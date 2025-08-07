/**
  * 作品相关数据的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:28:41
* */

import { reqGetWorkList } from '@/api/work-api';
import { parseWorkInfo } from '@/utils/parse';

export default defineStore('work', () => {
  /** 作品列表 */
  const workList = ref<WorkInfo[]>([]);

  /** 作品总数 */
  const totalWorkCount = ref(0);

  /** 每页获取作品数量 */
  const WORK_PAGE_SIZE = 10;

  /** 上次获取作品列表请求是否完成 */
  const isLastReqFinished = ref(true);

  /** 获取作品列表 */
  const getWorkList = async () => {
    if (!isLastReqFinished.value) return;

    isLastReqFinished.value = false;
    try {
      const resData = (await reqGetWorkList())?.data as ResData<AnyObject>;
      // 记录总作品数
      totalWorkCount.value = resData.data.totalResult;
      console.log('workList res', resData);
      if (resData.code === 200) {
        workList.value = (resData.data.list as Array<any>).map((item) => parseWorkInfo(item));
        console.log('workList', workList.value);
      } else {
        console.log('获取作品列表失败');
      }
    } catch (err) {
      console.error('getWorkList', err);
    }
    isLastReqFinished.value = true;
  };

  /** 获取并追加作品列表 */
  const appendWorkList = async () => {
    console.log('appendWorkList', isLastReqFinished.value);
    if (!isLastReqFinished.value) return;

    isLastReqFinished.value = false;
    try {
      // 如果当前显示的作品数量大于等于总作品数，就不再获取
      if (workList.value.length >= totalWorkCount.value) {
        isLastReqFinished.value = true;
        return;
      }

      // 要获取的页码
      const page = Math.ceil(workList.value.length / WORK_PAGE_SIZE) + 1;

      const resData = (await reqGetWorkList(page))?.data as ResData<AnyObject>;
      totalWorkCount.value = resData.data.totalResult;
      const newWorkList = (resData.data.list as Array<any>).map((item) => parseWorkInfo(item));
      workList.value = workList.value.concat(newWorkList);
      console.log('totalResult', totalWorkCount.value);
      console.log('appendWorkList', workList.value);
    } catch (err) {
      console.error('appendWorkList', err);
    }
    isLastReqFinished.value = true;
  };

  return {
    workList,
    getWorkList,
    appendWorkList,
  };
});
