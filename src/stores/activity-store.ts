/**
  * 动态相关数据的store
  * @author: Ruan Jiazhen
  * @date: 2024-04-28 17:25:19
* */

import { reqGetActivityList } from '@/api/activity-api';
import { parseActivityList } from '@/utils/parse';

export default defineStore('activity', () => {
  /** 动态列表 */
  const activityList = ref<ActivityInfo[]>([]);

  /** 当前显示的动态的数量 */
  const currentActivityCount = computed(() => activityList.value.length);

  /** 总动态数 */
  const totalActivityCount = ref(0);

  /** 每页获取动态数量 */
  const ACTIVITY_PAGE_SIZE = 10;

  /** 获取动态列表 */
  const getActivityList = async () => {
    try {
      const resData = (await reqGetActivityList())?.data as ResData<ActivityData>;
      activityList.value = parseActivityList(resData);
      totalActivityCount.value = resData.data.totalResult;
      console.log('activityList', activityList.value);
    } catch (err) {
      console.error('getActivityList', err);
    }
  };

  /** 获取并追加动态列表 */
  const appendActivityList = async () => {
    try {
      // 如果当前显示的动态数量大于等于总动态数，就不再获取
      if (currentActivityCount.value >= totalActivityCount.value) return;

      // 要获取的页码
      const page = Math.ceil(currentActivityCount.value / ACTIVITY_PAGE_SIZE) + 1;

      const resData = (await reqGetActivityList('', page))?.data as ResData<ActivityData>;
      totalActivityCount.value = resData.data.totalResult;
      const newActivityList = parseActivityList(resData);
      activityList.value = activityList.value.concat(newActivityList);
    } catch (err) {
      console.error('appendActivityList', err);
    }
  };

  return {
    activityList,
    getActivityList,
    appendActivityList,
  };
});
