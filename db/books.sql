DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS book;

CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    author_id INT NOT NULL
);

CREATE TABLE author (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO author(name) VALUES
('J.R.R Tolkien'),
('Antoine de Saint-Exupery'),
('J.K. Rowling'),
('Mikhail Bulgakov'),
('Lewis Carroll'),
('Agatha Christie'),
('Cao Xueqin');

INSERT INTO book(author_id, name) VALUES
(1, 'The Lord of the Rings'),
(2, 'The Little Prince (Le Petit Prince)'),
(1, 'The Hobbit'),
(3, 'Harry Potter and the Philosopher''s Stone'),
(4, 'The Master and Margarita'),
(5, 'Alice''s Adventures in Wonderland'),
(6, 'And Then There Were None'),
(7, 'Dream of the Red Chamber');