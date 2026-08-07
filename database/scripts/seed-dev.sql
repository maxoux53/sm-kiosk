BEGIN TRANSACTION;
  TRUNCATE TABLE vat RESTART IDENTITY CASCADE;
  TRUNCATE TABLE category RESTART IDENTITY CASCADE;
  TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;
  TRUNCATE TABLE event RESTART IDENTITY CASCADE;
  TRUNCATE TABLE membership RESTART IDENTITY CASCADE;
  TRUNCATE TABLE product RESTART IDENTITY CASCADE;
  TRUNCATE TABLE purchase RESTART IDENTITY CASCADE;
  TRUNCATE TABLE order_line RESTART IDENTITY CASCADE;

  INSERT INTO vat ("type", rate) VALUES
  ('A', 21),
  ('B', 12),
  ('C', 6);

  INSERT INTO category (label, vat_type, picture) VALUES
  ('Nourriture', 'A', 'e8801ca5-b73f-4226-8682-56f98a88fb00'),
  ('Boissons', 'B', '4abb63a9-959f-4e03-9e47-4ecfebb9a000'),
  ('Marchandises', 'C', '5d401cb3-aad8-4d91-2665-49d1fd737600');

  INSERT INTO "user" (first_name, last_name, email, password_hash, is_admin, avatar) VALUES
  ('Jean', 'Dupont', 'jean.dupont@example.com', '$argon2id$v=19$m=65536,p=4,t=3$F51rid3PPppsIk1Yy4Esmw$UCDS9ilVNYltewLmrZ2SxDDE9GR4QlpwPuXw+ADwP/M', TRUE, '9f0855fa-ce19-4658-292a-34d5972ba100'),  -- password: jeandupont123
  ('Marie', 'Martin', 'marie.martin@example.com', '$argon2id$v=19$m=65536,p=4,t=3$AairEWOQK9sjnxHOmg5m7w$QD5SJGMJyhQMaaKnglcSPsThCnz4kKFA1zJbzZthrNI', FALSE, '9c7f5c46-9914-477f-7e58-83a82988a900'),  -- password: mariemartin123
  ('Pierre', 'Dubois', 'pierre.dubois@example.com', '$argon2id$v=19$m=65536,p=4,t=3$j0F5cssaD0Bwe8ossJA+zA$Uew9KeyUzymuGP4WnP0D0ASukwaNSjiMYe7464/SSpA', FALSE, '2edf7a61-0e6e-4988-6b8a-613679f19f00'),  -- password: pierredubois123
  ('Test', 'User', 'test@dev.com', '$argon2id$v=19$m=65536,p=4,t=3$3M/9Q2ESo5EJGuHTe0Y0lQ$0kpTl5Hor0iUSWQgiNICW3XDvlekBz5jj/lh7/Nkynk', TRUE, '2edf7a61-0e6e-4988-6b8a-613679f19f00');  -- password: test123

  INSERT INTO event (name, location, image, iban) VALUES
  ('Festival d''Été', 'Parc Central', '9c7f5c46-9914-477f-7e58-83a82988a900', 'GB29 NWBK 6016 1331 9268 19'),
  ('Conférence Tech', 'Centre des Congrès', '9e0c2140-ab35-4942-e3e4-445402632300', 'DE89 3704 0044 0532 0130 00');

  INSERT INTO membership (user_id, event_id, role) VALUES
  (1, 1, 'host'),
  (2, 1, 'cashier'),
  (3, 2, 'guest');

  INSERT INTO product (label, is_available, excl_vat_price, picture, category_id, event_id) VALUES
  ('Burger', TRUE, 5.00, 'ce844a95-1ad2-465e-c554-fc9f74c42900', 1, 1),
  ('Soda', TRUE, 2.50, '54a3f697-3417-46e3-d3fd-dab356f91f00', 2, 1),
  ('T-Shirt', TRUE, 15.00, 'eaf413e3-8c02-4a2f-ea11-0f4082c44800', 3, 2);

  INSERT INTO purchase ("date", user_id) VALUES
  ('2023-10-01 10:00:00', 2),
  ('2023-10-02 14:30:00', 3);

  INSERT INTO order_line (product_id, purchase_id, quantity, price) VALUES
  (1, 1, 2, 10.00),
  (2, 1, 1, 2.50),
  (3, 2, 1, 15.00);
COMMIT;