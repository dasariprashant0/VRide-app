export const createAccount = async ({
  cometChat,
  uid,
  name,
  avatar,
}) => {
  const authKey = "ddaf006cb861cc260130419cc59620eaea7b1525";
  const user = new cometChat.User(uid);
  user.setName(name);
  user.setAvatar(avatar);
  try {
    const createdUser = await cometChat.createUser(user, authKey);
    return createdUser;
  } catch (error) {
    console.log("Error creating CometChat user:", error);
    throw new Error("Unable to create CometChat account.");
  }
};

export const login = async (cometChat, user) => {
  if (!user) return;
  const authKey = "ddaf006cb861cc260130419cc59620eaea7b1525";
  return await cometChat.login(user.id, authKey);
};
