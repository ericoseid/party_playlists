const createUserModule = require("../../persistence/userData/impl/UserDataDaoDefaultImpl.js");
const { queryUserData } = require("../persistence/userData/queryUserData.js");

async function handleCreateUserRequest(requestBody) {
  console.log(`Entering handle create user request`);

  if (
    !requestBody ||
    !requestBody.user_name ||
    !requestBody.user_email ||
    !requestBody.user_password
  ) {
    console.log("Missing request parameters");
    return 400;
  }

  try {
    await createUserModule.createUser(requestBody);

    return 200;
  } catch (e) {
    console.log(e);

    if (1062 === e) {
      return await handleDuplicateColumnError(requestBody);
    } else {
      return 500;
    }
  }
}

async function handleDuplicateColumnError(requestBody) {
  try {
    const userNameExists = await doesUserNameExist(requestBody);

    if (userNameExists) {
      return 470;
    }

    const userEmailExists = await doesUserEmailExist(requestBody);

    if (userEmailExists) {
      return 471;
    }

    return 500;
  } catch (e) {
    return 500;
  }
}

async function doesUserNameExist(requestBody) {
  const row = await queryUserData.queryByUserName(requestBody.user_name);

  return row.length > 0;
}

async function doesUserEmailExist(requestBody) {
  const row = await queryUserData.queryByUserEmail(requestBody.user_email);

  return row.length > 0;
}

module.exports.handleCreateUserRequest = handleCreateUserRequest;
