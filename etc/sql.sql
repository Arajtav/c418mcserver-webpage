create table sales (
    "rid"             SERIAL      NOT NULL PRIMARY KEY,
    "mcItemId"        VARCHAR(64) NOT NULL,
    "quantity"        INT         NOT NULL,
    "price"           INT         NOT NULL,
    "shop_seller"     VARCHAR(16) NOT NULL,
    "shop_location_x" INT         NOT NULL,
    "shop_location_y" SMALLINT    NOT NULL,
    "shop_location_z" INT         NOT NULL
);
