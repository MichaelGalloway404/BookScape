# BookScape  
This is a project for me to better understand and explore the React framework, It's a place that will have increasing user functionality. At the forefront it is a place for users to show what books they have read or want to read and be able to see others.  
  
Postgres Vercel info:  
  
CREATE TABLE users (  
  id SERIAL PRIMARY KEY,  
  username TEXT UNIQUE NOT NULL,  
  password_hash TEXT NOT NULL  
);  
  
TABLE user_books (  
  id SERIAL PRIMARY KEY,  
  
  user_id INTEGER NOT NULL,  
  isbn TEXT,  
  cover_id TEXT,  
    
  CONSTRAINT fk_user  
    FOREIGN KEY (user_id)  
    REFERENCES users(id)  
    ON DELETE CASCADE,  
  
  CONSTRAINT unique_user_book  
    UNIQUE (user_id, isbn)  
);  