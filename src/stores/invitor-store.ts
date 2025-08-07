export default defineStore('invitor', () => {
  /** 邀请人id */
  const invitorUserId = ref('');

  /** 更新邀请人id */
  const updateInvitorUserId = (id: string) => {
    invitorUserId.value = id;
  };

  return {
    invitorUserId,
    updateInvitorUserId,
  };
});
