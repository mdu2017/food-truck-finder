INSERT IGNORE INTO USER (USER_ID, Username, PRINCIPAL, PASSWORD, IS_OWNER)
VALUES
	(1, 'user', "useruser.com", "user", 1),
	(2, "owner", "owner@owner.com", "owner", 1),
    (3, "master", "master@master.com", "master", 1),
    (4, "regular", "norm@norm.com", "regular", 0);

INSERT IGNORE INTO FOOD_TYPE (TYPE_ID, TYPE) VALUES
		(0, 'AMERICAN'),
		(1, 'BBQ'),
		(2, 'BREAKFAST'),
		(3, 'CHINESE'),
		(4, 'DESERT'),
		(5, 'HEALTHY'),
		(6, 'INDIAN'),
		(7, 'MEDITERRANEAN'),
		(8, 'MEXICAN'),
		(9, 'PIZZA'),
		(10, 'SEAFOOD'),
		(11, 'VEGITARIAN'),
		(12, 'VEGAN'),
		(13, 'VIETNAMESE');

INSERT IGNORE INTO FOOD_TRUCK(FOOD_TRUCK_ID, OWNER_ID, NAME, TYPE, TRUCK_IMAGE, PRICE_LOW, PRICE_HIGH, STATUS, DESCRIPTION)
VALUES
	(1, 1, "Torchy's Taco", 8, 'z', 1.99, 9.99, "OPEN", "Taco truck here!"),
    (2, 2, "Rare Burger", 0, 'z', 4.49, 11.99, "OPEN", "Best burger truck"),
    (3, 3, "Spicy Pasta", 5, 'z', 5.99, 14.99, "CLOSED", "Spicy pasta");

INSERT IGNORE INTO truck_stop (STOP_ID, START, END, LATITUDE, LONGITUDE)
VALUES
	(1, "2019-01-01 10:00:00", "2019-10-10 10:00:00", 31.532965359436357, -97.11),
    (2, "2019-05-10 12:00:00", "2019-10-10 22:10:10", 31.538813002764755, -97.14596871840052),
    (3, "2020-03-17 17:31:14", "2019-5-16 23:59:59", 31.532965359436357, -97.12021951185756);

--
-- INSERT IGNORE INTO SCHEDULE (TRUCK_ID, DAY, STOP_ID)
-- VALUES
-- 	(1, "MONDAY", 1),
--     (2, "TUESDAY", 2),
--     (3, "SUNDAY", 3);

-- INSERT IGNORE INTO event (EVENT_ID, DESCRIPTION, STOP_ID)
-- VALUES
-- 	(1, "Taco Party", 1),
--     (2, "Burger Feast", 2),
--     (3, "Pasta Buffet", 3);

-- INSERT IGNORE INTO attending_event (TRUCK_ID, EVENT_ID)
-- VALUES
-- 	(1, 1),
--     (2, 2),
--     (3, 3);

INSERT IGNORE INTO deal (TRUCK_ID, MESSAGE, START, END)
VALUES
	(1, "TACO SPECIAL", "2019-02-01 10:00:00", "2019-02-14 12:00:00"),
    (2, "Burger SPECIAL", "2019-12-21 20:00:00", "2019-12-28 23:59:59"),
    (3, "Pasta SPECIAL", "2019-04-20 09:15:00", "2019-07-04 19:00:00");

-- INSERT IGNORE INTO menu (ITEM_ID, TRUCK_ID, NAME, DESCRIPTION, PRICE)
-- VALUES
-- 	(1, 1, "TorchyMenu", "Taco Menu", 5.99),
--     (2, 2, "JMenu", "JMenu Item", 10.99),
--     (3, 3, "MenuMenu", "A Menu", 9.99);

INSERT IGNORE INTO notification (TRUCK_ID, USER_ID, MESSAGE, SENT, VIEWED)
VALUES
	(1, 1, "FT notification1", "2019-04-20 09:15:00", 1),
    (2, 2, "Special Notification", "2019-01-01 12:00:00", 1),
    (3, 3, "Closing", "2019-06-20 10:15:00", 0);

INSERT IGNORE INTO review (USER_ID, MESSAGE, RATING, DATE)
VALUES
	(1, "Good truck", 9, "2019-01-01 12:00:00"),
    (2, "Average food", 5, "2019-03-01 15:00:00"),
    (3, "New truck", 7, "2019-12-25 13:00:00");

INSERT IGNORE INTO subscriptions (TRUCK_ID, USER_ID)
VALUES
	(1, 1),
    (2, 2),
    (3, 3);


