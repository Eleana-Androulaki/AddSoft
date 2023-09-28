const formatAmount = (
    amount = 0,
    unit = 'EUR',
    rounded = true,
) => {
    switch (unit) {
        case 'EUR':
            return (
                (Number(amount) || 0).toFixed(rounded ? 0 : 2) + '€'
            )
        default:
            return '';
    }
};


export default formatAmount;