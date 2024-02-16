//! User queries
const getUsers = 'SELECT * FROM users';
const checkEmail = 'SELECT * FROM users WHERE email = $1';
const addNewUser = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
const checkUserId = 'SELECT * FROM users WHERE id = $1';

//! Document queries
const getAllDocuments = 'SELECT * FROM documents';
/*const getBinData = SELECT json_build_object(
    'id', id,
    'titel', titel,
    'user_id', user_id,
    'content', encode(content, 'base64')
) AS document
FROM documents*/
const addNewDocument =
  'INSERT INTO documents (titel, content, user_id) VALUES ($1, $2, $3) RETURNING ';

const documentByUserId = 'SELECT FROM documents WHERE user_id = $1';

export {
  getUsers,
  checkEmail,
  addNewUser,
  checkUserId,
  getAllDocuments,
  addNewDocument,
  //getBinData,
  documentByUserId,
};

//To use:
//const userDocuments = await db.query(documentByUserId, [user_id]);