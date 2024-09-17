-- CreateTable
CREATE TABLE `publisher` (
    `publisher_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NOT NULL,
    `deletion_date` DATETIME(3) NULL,

    PRIMARY KEY (`publisher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book` (
    `book_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `max_rental_days` INTEGER NOT NULL,
    `deletion_date` DATETIME(3) NULL,
    `publisher_id` INTEGER NULL,
    `number_of_rentals` INTEGER NOT NULL,
    `number_of_returns` INTEGER NOT NULL,

    PRIMARY KEY (`book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(250) NOT NULL,
    `deletion_date` DATETIME(3) NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book_rental` (
    `book_rental_id` INTEGER NOT NULL AUTO_INCREMENT,
    `creation_date` DATETIME(3) NOT NULL,
    `max_return_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NULL,
    `book_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,

    PRIMARY KEY (`book_rental_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_publisher_id_fkey` FOREIGN KEY (`publisher_id`) REFERENCES `publisher`(`publisher_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `book_rental` ADD CONSTRAINT `book_rental_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `book`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `book_rental` ADD CONSTRAINT `book_rental_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
