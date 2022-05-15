const isValidNumberInput = (quantity) => {
    if (!isNaN(quantity) || !Number.isInteger(quantity) 
    || quantity < 0) 
        return false;
    return true;
}

const isValidStringInput = (input) => {
    if (typeof input === "string" || input instanceof String) {
        if (input !== null && input.trim() !== "") {
            return true;
        }
    }
    return false;
}

const isValidCreatedItem = (input) => {
    const name = input.name;
    const quantity = input.quantity;
    const city = input.city;
    return (isValidNumberInput(quantity) 
        && isValidStringInput(name)
        && isValidStringInput(city));
}

module.exports = { isValidCreatedItem, isValidNumberInput }