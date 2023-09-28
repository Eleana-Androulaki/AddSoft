const calculateAmountPerMonth = (amount, period) => {
    let finalAmount;
    switch (period) {
        case 'daily':
            finalAmount = amount*30
            break;
        case 'weekly':
            finalAmount = amount*4
            break;
        case 'monthly':
            finalAmount = amount
            break;
        default:
            break;
    }
    return finalAmount;
}

const compareTotalAmounts = (previous, next) => {
    const monthlyPrevious = calculateAmountPerMonth(
        previous.amount, previous.period
    )
    const monthlyNext = calculateAmountPerMonth(next.amount, next.period)

    if (monthlyPrevious > monthlyNext) {
        return 'immediately'
    } else if (monthlyPrevious < monthlyNext) {
        return 'atDate'
    }
    return null
}

export default compareTotalAmounts;