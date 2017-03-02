CREATE TABLE USERS (
USER_ID VARCHAR(20) PRIMARY KEY NOT NULL,
FNAME TEXT NOT NULL,
LNAME TEXT NOT NULL,
ROLE VARCHAR(10) NOT NULL,
EMAIL VARCHAR(50) NOT NULL,
DATE_CREATED DATE NOT NULL,
MOBILE VARCHAR(10) NOT NULL,
COMPANY TEXT NOT NULL,
PASSWORD VARCHAR(8) NOT NULL);



CREATE TABLE AUCTION(
AUCTION_ID VARCHAR(20) PRIMARY KEY NOT NULL,
DESCRIPTION TEXT,
NAME TEXT NOT NULL,
DUE_DATE DATE NOT NULL,
START_TIME TIME NOT NULL,
END_TIME TIME NOT NULL,
DATE_CREATED DATE NOT NULL,
CREATED_BY VARCHAR(20) NOT NULL);

CREATE TABLE ITEMS(
ITEM_ID VARCHAR(20) PRIMARY KEY NOT NULL,
ITEM_NAME VARCHAR(50) NOT NULL,
DESCRIPTION TEXT);


CREATE TABLE AUCTION_VENDORS(
AUCTION_ID VARCHAR(20) NOT NULL,
USER_ID VARCHAR(20) NOT NULL);


CREATE TABLE AUCTION_ITEMS(
AUCTION_ID VARCHAR(20) NOT NULL,
ITEM_ID VARCHAR(20) NOT NULL);

CREATE TABLE BID(
BID_ID VARCHAR(20) NOT NULL,
AUCTION_ID VARCHAR(20) NOT NULL,
ITEM_ID VARCHAR(20) NOT NULL,
VENDOR_ID VARCHAR(20) NOT NULL,
TIME TIME NOT NULL,
BID_AMOUNT DECIMAL NOT NULL);

CREATE SEQUENCE bid_id_seq;
ALTER TABLE user ALTER bid_id SET DEFAULT NEXTVAL('user_id_seq');

ALTER TABLE AUCTION
ADD FOREIGN KEY (CREATED_BY) REFERENCES USERS;

ALTER TABLE AUCTION_VENDORS
ADD FOREIGN KEY (AUCTION_ID) REFERENCES AUCTION;

ALTER TABLE AUCTION_VENDORS
ADD FOREIGN KEY (USER_ID) REFERENCES USERS;

//add foreign key to auction items
ALTER TABLE AUCTION_ITEMS
ADD FOREIGN KEY (AUCTION_ID) REFERENCES AUCTION;

/////////adding entries
INSERT INTO users(user_id, fname, lname, role, email, date_created, mobile, company, password)
 values('mas_admin', 'Nalaka', 'Raja', 'admin', 'nalaka@gmail.com', '2017-02-17', '0771234567', 'IBM');

INSERT INTO users(user_id, fname, lname, role, email, date_created, mobile, company, password)
 values('mas_admin2', 'Deshan', 'Kalu', 'admin', 'deshan@gmail.com', current_date, '0771234567', 'IBM', '1234');

INSERT INTO items(item_id, item_name, description)
 values('FAB002', 'Fabric', 'Fabric for bras');

INSERT INTO auction(auction_id, description, name, due_date, start_time, end_time, date_created, created_by)
 values('AUC001', 'Auction for buying fabrics', 'Fabric', '2017-01-01', '20:00:00', '21:00:00', '2016-12-20', 'mas_admin');
INSERT INTO auction(auction_id, description, name, due_date, start_time, end_time, date_created, created_by)
 values('AUC002', 'Auction for buying Metal', 'Metal', '2017-01-05', '20:00:00', '21:00:00', '2016-05-3', 'mas_admin');

INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB001', 'VEN001', '24:00:00', 150);
INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB001', 'VEN001', '24:00:00', 120);
INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB002', 'VEN001', '24:00:00', 230);
INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB002', 'VEN001', '24:00:00', 200);
INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB003', 'VEN001', '24:00:00', 320);
INSERT INTO bid(auction_id, item_id, vendor_id, time, bid_amount)
 values('AUC001', 'FAB003', 'VEN001', '24:00:00', 310);

SELECT item_id, MIN(bid_amount) FROM bid WHERE auction_id='AUC001' GROUP BY item_id;

SELECT DISTINCT ON (item_id) item_id, MIN(bid_amount) OVER (PARTITION BY item_id) AS min_amount FROM bid WHERE auction_id='AUC001';

SELECT item_id, bid_amount FROM bid GROUP BY vendor_id, time LIMIT 20

SELECT m.item_id, m.bid_amount, t.mx
FROM (
    SELECT cname, MAX(avg) AS mx
    FROM bid
    GROUP BY cname
    ) t JOIN bid m ON m.it = t.cname AND t.mx = m.avg
;












