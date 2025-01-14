module.exports = () => {
  let allGood = true;
  let string = "";
  if (!process.env.ROLE_NAME) {
    allGood = false;
    string += "ROLE_NAME missing, ";
  }
  if (!process.env.DATABASE_NAME) {
    allGood = false;
    string += "DATABASE_NAME missing, ";
  }
  if (!process.env.ROLE_PASSWORD) {
    allGood = false;
    string += "ROLE_PASSWORD missing, ";
  }
  if (string.length > 0) {
    string.length = string.length - 2;
  }
  if (!allGood) {
    return console.error(string);
  }
  return true;
};
