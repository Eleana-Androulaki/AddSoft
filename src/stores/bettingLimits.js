import { defineStore } from 'pinia';
import { ref } from 'vue';
import mainApi from 'src/api/mainApi';
import formatAmount from 'src/helpers/formatAmount';
import { useI18n } from 'vue-i18n'
import moment from 'moment';

export const useBettingLimitsStore = defineStore('bettingLimits', () => {
  const { t } = useI18n()
  const depositLimits = ref({});
  const sanitizedDepositLimits = ref({});
  const lossLimits = ref({});
  const sanitizedLossLimits = ref({});
  const timeLimits = ref({});
  const sanitizedTimeLimits = ref({});

  const fetchDepositLimits = async () => {
    try {
      const response = await mainApi.get('/depositLimits');
      depositLimits.value = response.data
      sanitizedDepositLimits.value = depositLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const editDepositLimits = async (newLimits) => {
    const periods = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }
    const requestObj = {
      ...depositLimits.value,
      amount: newLimits.newAmount,
      changedAt: newLimits.savedAt,
      timePeriod: newLimits.newPeriod,
      ableTochangedAt: moment(newLimits.savedAt).add(periods[newLimits.newPeriod], 'days').toISOString()
    }
    try {
      const response = await mainApi.put('/depositLimits/',requestObj);
      depositLimits.value = response.data
      sanitizedDepositLimits.value = depositLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const fetchLossLimits = async () => {
    try {
      const response = await mainApi.get('/lossLimits');
      lossLimits.value = response.data
      sanitizedLossLimits.value = lossLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const editLossLimits = async (newLimits) => {
    const periods = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }
    const requestObj = {
      ...lossLimits.value,
      amount: newLimits.newAmount,
      changedAt: newLimits.savedAt,
      timePeriod: newLimits.newPeriod,
      ableTochangedAt: moment(newLimits.savedAt).add(periods[newLimits.newPeriod], 'days').toISOString()
    }
    try {
      const response = await mainApi.put('/lossLimits/',requestObj);
      lossLimits.value = response.data
      sanitizedLossLimits.value = lossLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const fetchTimeLimits = async () => {
    try {
      const response = await mainApi.get('/timeLimits');
      timeLimits.value = response.data
      sanitizedTimeLimits.value = timeLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const editTimeLimits = async (newLimits) => {
    const periods = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }
    const requestObj = {
      ...timeLimits.value,
      amount: newLimits.newAmount,
      changedAt: newLimits.savedAt,
      timePeriod: newLimits.newPeriod,
      ableTochangedAt: moment(newLimits.savedAt).add(periods[newLimits.newPeriod], 'days').toISOString()
    }
    try {
      const response = await mainApi.put('/timeLimits/',requestObj);
      timeLimits.value = response.data
      sanitizedTimeLimits.value = timeLimitsSanitization(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const depositLimitsSanitization = (dep) => {
    const currentAmount = formatAmount(dep.amount.value, dep.amount.unit)
      const amountOptions = dep.amountOptions.map(({value, unit}) => {
        return (
          value !== 'other'
          ? formatAmount(value, unit)
          : t('otherAmount')
        )
      })

      const selectedAmount = amountOptions.find(opt => opt === currentAmount) ?? t('otherAmount')
      const formattedChangedAt = moment(dep.changedAt).format('DD/MM/yyyy hh:mm')
      const formattedAbleTochangedAt = moment(dep.ableTochangedAt).format('DD/MM/yyyy hh:mm')
      
      return {
        ...dep,
        currentAmount,
        amountOptions,
        timePeriod: {
          value: dep.timePeriod,
          label: t(`timePeriods.${dep.timePeriod}`)
        },
        periodOptions: dep.periodOptions.map(opt => (
          {
            value: opt,
            label: t(`timePeriods.${opt}`)
          }
        )),
        selectedAmount,
        formattedChangedAt,
        formattedAbleTochangedAt,
        unit: dep.amount.unit
      }
  }

  const lossLimitsSanitization = (loss) => {
    const currentAmount = formatAmount(loss.amount.value, loss.amount.unit)
      const amountOptions = loss.amountOptions.map(({value, unit}) => {
        return (
          value !== 'other'
          ? formatAmount(value, unit)
          : t('otherAmount')
        )
      })

      const selectedAmount = amountOptions.find(opt => opt === currentAmount) ?? t('otherAmount')
      const formattedChangedAt = moment(loss.changedAt).format('DD/MM/yyyy hh:mm')
      const formattedAbleTochangedAt = moment(loss.ableTochangedAt).format('DD/MM/yyyy hh:mm')
      
      return {
        ...loss,
        currentAmount,
        amountOptions,
        timePeriod: {
          value: loss.timePeriod,
          label: t(`timePeriods.${loss.timePeriod}`)
        },
        periodOptions: loss.periodOptions.map(opt => (
          {
            value: opt,
            label: t(`timePeriods.${opt}`)
          }
        )),
        selectedAmount,
        formattedChangedAt,
        formattedAbleTochangedAt,
        unit: loss.amount.unit
      }
  }

  const timeLimitsSanitization = (time) => {
    const currentAmount = t(
      'hours', 
      {
        hours: time.amount.value.split(':')[0], 
        min: time.amount.value.split(':')[1]
      }
    )
    const amountOptions = time.amountOptions.map(({value}) => {
      return (
        value === 'other'
        ? t('otherDuration')
        : t('hours', {hours: value.split(':')[0], min: value.split(':')[1]})
      )
    })

    const selectedAmount = amountOptions.find(opt => opt === currentAmount) ?? t('otherDuration')
    const formattedChangedAt = moment(time.changedAt).format('DD/MM/yyyy hh:mm')
    const formattedAbleTochangedAt = moment(time.ableTochangedAt).format('DD/MM/yyyy hh:mm')
      
    return {
      ...time,
      currentAmount,
      amountOptions,
      timePeriod: {
        value: time.timePeriod,
        label: t(`timePeriods.${time.timePeriod}`)
      },
      periodOptions: time.periodOptions.map(opt => (
        {
          value: opt,
          label: t(`timePeriods.${opt}`)
        }
      )),
      selectedAmount,
      formattedChangedAt,
      formattedAbleTochangedAt,
      unit: time.amount.unit
    }
  }

  return {
    depositLimits,
    sanitizedDepositLimits,
    lossLimits,
    sanitizedLossLimits,
    timeLimits,
    sanitizedTimeLimits,
    fetchDepositLimits,
    fetchLossLimits,
    fetchTimeLimits,
    editDepositLimits,
    editLossLimits,
    editTimeLimits
  }
})
