class PostModel {
    constructor(db) {
        this.db = db;
    }

    createPostTable() {
        const tableDefinition = {
            tableName: 'posts',
            columns: [
                { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
                { name: 'subject', type: 'VARCHAR(255)' },
                { name: 'body', type: 'TEXT' },
                { name: 'timestamp', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
            ]
        };

        this.db.createTableFromDefinition(tableDefinition);
    }

    async createPost(subject, body) {
        const query = 'INSERT INTO posts (subject, body) VALUES (?, ?)';
        try {
            const result = await this.db.query(query, [subject, body]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async deletePostById(postId) {
        const query = 'DELETE FROM posts WHERE id = ?';
        try {
            const result = await this.db.query(query, [postId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    async editPost(postId, newSubject, newBody) {
        const query = 'UPDATE posts SET subject = ?, body = ? WHERE id = ?';
        try {
            const result = await this.db.query(query, [newSubject, newBody, postId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error editing post:', error);
            throw error;
        }
    }

    async getAllPosts() {
        const query = 'SELECT * FROM posts ORDER BY timestamp DESC';
        try {
            const results = await this.db.query(query);
            return results;
        } catch (error) {
            console.error('Error retrieving posts:', error);
            throw error;
        }
    }
}

module.exports = PostModel;
