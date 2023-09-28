const amountStringToObj = (amount, unit = 'EUR') => {
    switch (unit) {
        case 'EUR':
            return {
                value: Number(amount.match(/\d+/g)[0]),
                unit: 'EUR'
            }
        case 'hours':
            return {
                value: amount.match(/\d+/g).join(':'),
                unit: 'hours'
            }
        default:
            return '';
    }
}


export default amountStringToObj;