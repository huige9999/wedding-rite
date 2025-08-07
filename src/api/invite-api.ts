// 邀请相关接口
import { reqPost } from './request';

/**
 * 登记邀请信息
 * @param inviterId 邀请人id
 */
export const reqRegisterInviteInfo = (inviterId: string) => reqPost(
  '/info/saveInvite',
  { inviter_id: inviterId },
);
