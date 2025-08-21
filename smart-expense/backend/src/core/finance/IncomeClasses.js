class Income {
    #incomeID;
    #userID;
    #amount;
    #date;
    #description;
    #category;

    constructor(incomeID, userID, amount, date, description, category) {
        this.#incomeID = incomeID;
        this.#userID = userID;
        this.#amount = amount;
        this.#date = date;
        this.#description = description;
        this.#category = category;
    }

    // Add or update income details
    add(amount, date, description, category) {
        this.#amount = amount;
        this.#date = date;
        this.#description = description;
        this.#category = category;
    }

    // Delete income (could set all fields to null or implement as needed)
    delete() {
        this.#amount = null;
        this.#date = null;
        this.#description = null;
        this.#category = null;
    }

    // Get all details as an object
    getDetails() {
        return {
            incomeID: this.#incomeID,
            userID: this.#userID,
            amount: this.#amount,
            date: this.#date,
            description: this.#description,
            category: this.#category
        };
    }

    // Getters
    getIncomeID() { return this.#incomeID; }
    getUserID() { return this.#userID; }
    getAmount() { return this.#amount; }
    getDate() { return this.#date; }
    getDescription() { return this.#description; }
    getCategory() { return this.#category; }

    // Setters
    setAmount(amount) { this.#amount = amount; }
    setDate(date) { this.#date = date; }
    setDescription(description) { this.#description = description; }
    setCategory(category) { this.#category = category; }
}

// Child class for regular income
class IncomeRegular extends Income {
    #updateDate;

    constructor(incomeID, userID, amount, date, description, category, updateDate) {
        super(incomeID, userID, amount, date, description, category);
        this.#updateDate = updateDate;
    }

    autoUpdate(newAmount, newDate, newDescription, newCategory, newUpdateDate) {
        // Automatically update the income details and updateDate
        this.setAmount(newAmount);
        this.setDate(newDate);
        this.setDescription(newDescription);
        this.setCategory(newCategory);
        this.#updateDate = newUpdateDate;
    }

    getUpdateDate() {
        return this.#updateDate;
    }

    setUpdateDate(updateDate) {
        this.#updateDate = updateDate;
    }

    // Override getDetails to include updateDate
    getDetails() {
        return {
            ...super.getDetails(),
            updateDate: this.#updateDate
        };
    }
}

// Child class for irregular income
class IncomeIrregular extends Income {
    // No extra attributes or methods
}

module.exports = {
    Income,
    IncomeRegular,
    IncomeIrregular
};