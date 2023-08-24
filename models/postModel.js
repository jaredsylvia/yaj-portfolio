class PostModel {
    constructor(db) {
        this.db = db;
    }

    createPost(subject, body) {
        const query = 'INSERT INTO posts (subject, body) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            this.db.query(query, [subject, body], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }

    deletePostById(postId) {
        const query = 'DELETE FROM posts WHERE id = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [postId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    editPost(postId, newSubject, newBody) {
        const query = 'UPDATE posts SET subject = ?, body = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            this.db.query(query, [newSubject, newBody, postId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    getAllPosts() {
        const query = 'SELECT * FROM posts ORDER BY timestamp DESC';
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    
}

module.exports = PostModel;
