CREATE TABLE Users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(2048) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE directors (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(100) NOT NULL
);

CREATE TABLE Films (
                       id SERIAL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       img TEXT,
                       genre VARCHAR(50),
                       director_id INT REFERENCES directors(id) ON DELETE SET NULL,
                       release_date DATE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Watchlist (
                           id SERIAL PRIMARY KEY,
                           user_id INT NOT NULL,
                           film_id INT NOT NULL,
                           status VARCHAR(20) NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (user_id) REFERENCES Users(id),
                           FOREIGN KEY (film_id) REFERENCES Films(id)
);

CREATE TABLE Reviews (
                         id SERIAL PRIMARY KEY,
                         user_id INT NOT NULL,
                         film_id INT NOT NULL,
                         username VARCHAR(50),
                         rating INT CHECK (rating >= 1 AND rating <= 5),
                         review_text TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES Users(id),
                         FOREIGN KEY (film_id) REFERENCES Films(id)
);

CREATE TABLE Actors (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL
);

CREATE TABLE film_actors (
                             film_id INT REFERENCES films(id) ON DELETE CASCADE,
                             actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
                             PRIMARY KEY (film_id, actor_id)
);


