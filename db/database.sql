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
                             id SERIAL PRIMARY KEY,
                             film_id INT REFERENCES films(id) ON DELETE CASCADE,
                             actor_id INT REFERENCES actors(id) ON DELETE CASCADE
);

-- Προσθήκη σκηνοθετών
INSERT INTO directors (name) 
VALUES 
('Christopher Nolan'),
('Quentin Tarantino'),
('Steven Spielberg'),
('Martin Scorsese'),
('James Cameron'),
('Ridley Scott'),
('Peter Jackson'),
('Francis Ford Coppola'),
('George Lucas'),
('Alfred Hitchcock');

-- Προσθήκη ταινιών
INSERT INTO films (title, description, img, genre, director_id, release_date) 
VALUES
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 'https://image.tmdb.org/t/p/original/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 'Science Fiction', 1, '2010-07-16'),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.', 'https://image.tmdb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 'Crime', 2, '1994-10-14'),
('Jurassic Park', 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids.', 'https://image.tmdb.org/t/p/original/9i3plLl89DHMz7mahksDaAo7HIS.jpg', 'Adventure', 3, '1993-06-11'),
('The Wolf of Wall Street', 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life.', 'https://image.tmdb.org/t/p/original/sOxr33wnRuKazR9ClHek73T8qnK.jpg', 'Biography', 4, '2013-12-25'),
('Avatar', 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following orders.', 'https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', 'Science Fiction', 5, '2009-12-18'),
('Gladiator', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.', 'https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 'Action', 6, '2000-05-05'),
('The Lord of the Rings: The Fellowship of the Ring', 'A meek Hobbit and eight companions set out on a journey to destroy the One Ring.', 'https://image.tmdb.org/t/p/original/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 'Fantasy', 7, '2001-12-19'),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.', 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg', 'Crime', 8, '1972-03-24'),
('Star Wars: A New Hope', 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy.', 'https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', 'Science Fiction', 9, '1977-05-25'),
('Psycho', 'A Phoenix secretary embezzles $40,000 from her employer''s client, goes on the run, and checks into a remote motel.', 'https://image.tmdb.org/t/p/original/81d8oyEFgj7FlxJqSDXWr8JH8kV.jpg', 'Horror', 10, '1960-06-16');
-- Προσθήκη ηθοποιών
INSERT INTO actors (name) 
VALUES
('Leonardo DiCaprio'),
('Samuel L. Jackson'),
('Bryce Dallas Howard'),
('Margot Robbie'),
('Zoe Saldana'),
('Russell Crowe'),
('Elijah Wood'),
('Marlon Brando'),
('Carrie Fisher'),
('Anthony Perkins'),
('Uma Thurman'),
('Bruce Willis'),
('Harrison Ford'),
('Viggo Mortensen'),
('Robert De Niro'),
('Al Pacino');

-- Συσχέτιση ταινιών με ηθοποιούς
INSERT INTO film_actors (film_id, actor_id)
VALUES
(1, 1), -- Leonardo DiCaprio in Inception
(2, 2), -- Samuel L. Jackson in Pulp Fiction
(2, 11), -- Uma Thurman in Pulp Fiction
(2, 12), -- Bruce Willis in Pulp Fiction
(3, 3), -- Bryce Dallas Howard in Jurassic Park
(4, 1), -- Leonardo DiCaprio in The Wolf of Wall Street
(4, 4), -- Margot Robbie in The Wolf of Wall Street
(5, 5), -- Zoe Saldana in Avatar
(6, 6), -- Russell Crowe in Gladiator
(7, 7), -- Elijah Wood in The Lord of the Rings
(7, 13), -- Viggo Mortensen in The Lord of the Rings
(8, 8), -- Marlon Brando in The Godfather
(8, 16), -- Al Pacino in The Godfather
(9, 9), -- Carrie Fisher in Star Wars: A New Hope
(9, 13), -- Harrison Ford in Star Wars: A New Hope
(10, 10); -- Anthony Perkins in Psycho



