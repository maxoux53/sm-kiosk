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
  ('Nourriture', 'A', 'c899b7a3-999a-471b-e4c6-823b353aed00'),
  ('Boissons', 'B', 'dedb4f7b-23cf-4afa-76a7-ba5ba7411d00'),
  ('Marchandises', 'C', '0060373a-9189-4ae9-ca33-69def9212a00');

  INSERT INTO "user" (first_name, last_name, email, password_hash, is_admin, avatar) VALUES
  ('Jean', 'Dupont', 'jean.dupont@example.com', '$argon2id$v=19$m=65536,p=4,t=3$F51rid3PPppsIk1Yy4Esmw$UCDS9ilVNYltewLmrZ2SxDDE9GR4QlpwPuXw+ADwP/M', TRUE, '89f983e1-5675-4fa6-510f-afd46e18a200'),  -- password: jeandupont123
  ('Marie', 'Martin', 'marie.martin@example.com', '$argon2id$v=19$m=65536,p=4,t=3$AairEWOQK9sjnxHOmg5m7w$QD5SJGMJyhQMaaKnglcSPsThCnz4kKFA1zJbzZthrNI', FALSE, '10d761b2-79c9-47a6-f59b-f23d2038df00'),  -- password: mariemartin123
  ('Pierre', 'Dubois', 'pierre.dubois@example.com', '$argon2id$v=19$m=65536,p=4,t=3$j0F5cssaD0Bwe8ossJA+zA$Uew9KeyUzymuGP4WnP0D0ASukwaNSjiMYe7464/SSpA', FALSE, '7416b5fc-22b6-421f-0018-9d8a66efc700'),  -- password: pierredubois123
  ('Test', 'User', 'test@dev.com', '$argon2id$v=19$m=65536,p=4,t=3$3M/9Q2ESo5EJGuHTe0Y0lQ$0kpTl5Hor0iUSWQgiNICW3XDvlekBz5jj/lh7/Nkynk', TRUE, '6adabbd1-68be-4301-766d-6663ca48d700');  -- password: test123

  INSERT INTO event (name, location, image, iban) VALUES
  ('Festival d''Été', 'Parc Central', 'ca8d31ae-35c8-4faa-2daa-18c5b33c6d00', 'GB29 NWBK 6016 1331 9268 19'),
  ('Conférence Tech', 'Centre des Congrès', '486899f1-68a0-42a3-4be9-a31d0ca00000', 'DE89 3704 0044 0532 0130 00');

  INSERT INTO membership (user_id, event_id, role) VALUES
  (1, 1, 'host'),
  (2, 1, 'cashier'),
  (3, 2, 'guest');

  INSERT INTO product (label, is_available, excl_vat_price, picture, category_id, event_id) VALUES
  ('Burger', TRUE, 5.00, '148f0e0f-03b6-43e7-ce51-06abcafcc400', 1, 1),
  ('Soda', TRUE, 2.50, '30cea168-2f93-4af8-b658-3cda7b959500', 2, 1),
  ('T-Shirt', TRUE, 15.00, 'b38dbd78-ac80-42b2-fc0f-6e40fe6c7400', 3, 2);

  INSERT INTO purchase ("date", user_id) VALUES
  ('2023-10-01 10:00:00', 2),
  ('2023-10-02 14:30:00', 3);

  INSERT INTO order_line (product_id, purchase_id, quantity, price) VALUES
  (1, 1, 2, 10.00),
  (2, 1, 1, 2.50),
  (3, 2, 1, 15.00);
COMMIT;