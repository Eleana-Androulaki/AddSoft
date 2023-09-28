<template>
    <q-card class="text-black betting-limit-card">
      <q-card-section class="flex justify-between items-center">
        <slot name="title">
            <div v-if="title" class="betting-limit-card__title">
                <div class="betting-limit-card__title--icon">
                    <q-icon 
                        v-if="titleIcon"
                        :name="titleIcon" 
                        size="sm" 
                    />
                </div>
                <h4 class="betting-limit-card__title--text">{{ title }}</h4>
            </div>
        </slot>
            
        <slot name="tooltip">
            <q-icon 
                v-if="tooltipText"
                :name="tooltipIcon" 
                :size="tooltipSize" 
                class="cursor-pointer"
            >
                <q-popup-proxy >
                    <q-banner>
                        {{ tooltipText }}
                    </q-banner>
                </q-popup-proxy>
            </q-icon>
        </slot>
      </q-card-section>
      <q-card-section>
        <div class="betting-limit-card__form">
            <div v-if="label" class="betting-limit-card__form--label">
                <div>{{ label }}</div>
                <div 
                    class="betting-limit-card__form--label-date"
                >
                    {{formDateLabel}}
                </div>
            </div>

            <div class="betting-limit-card__form--fields">
                <q-select 
                    class="q-mt-xs betting-limit-card__form--fields-select"
                    outlined 
                    v-model="period" 
                    :options="periodOptions" 
                    :disable="isEditDisabled"
                />
                <q-select 
                    class="q-mt-xs betting-limit-card__form--fields-select"
                    outlined 
                    v-model="amountFromSelect" 
                    :options="amountOptions" 
                    :disable="isEditDisabled"
                />
            </div>
            <q-input 
                v-if="showExtraField && unit === 'hours'"
                class="q-mt-sm"
                filled 
                v-model="amount"
                :disable="isEditDisabled"
                readonly
            >
                <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy 
                            cover 
                            transition-show="scale" 
                            transition-hide="scale"
                        >
                            <q-time 
                                v-model="amount"
                                format24h
                            >
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
                
            <q-input 
                v-else-if="showExtraField"
                class="q-mt-sm"
                outlined 
                v-model="amount" 
                :disable="isEditDisabled"
            >
                <template v-slot:prepend>
                    <q-icon name="euro" />
                </template>
            </q-input>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="betting-limit-card__actions">
            <slot name="sticky-disclaimer" v-if="stickyDisclaimerText">
                <div class="betting-limit-card__actions--disc">
                    {{ stickyDisclaimerText }}
                </div>
            </slot>
            
            <slot name="disclaimer" v-if="disclaimerText">
                <div v-if="!isEditDisabled" class="betting-limit-card__actions--disc">
                    {{ disclaimerText }}
                </div>
            </slot>
            <slot name="currentLimitNotification" v-if="currentLimitText">
                <div v-if="!isEditDisabled" class="flex">
                    <label 
                        class="betting-limit-card__actions--current-limit-title"
                    >
                        {{ currentLimitText }}
                    </label>
                    <label
                        class="betting-limit-card__actions--current-limit-text"
                    >
                        {{ currentAmountDisc }}
                    </label>
                </div>
            </slot>

            <slot name="newLimitNotification" v-if="newLimitText && newAmount">
                <div v-if="!isEditDisabled" class="flex">
                    <label 
                        class="betting-limit-card__actions--current-limit-title"
                    >
                        {{ newLimitText }}
                    </label>
                    <label
                        class="betting-limit-card__actions--current-limit-text"
                    >
                        {{ newAmountDisc }}, {{ timeToBeActiveText }}
                    </label>
                </div>
            </slot>

            <slot name="actions">
                <div class="flex q-mt-md justify-end">
                    <q-btn 
                        v-if="isEditDisabled"
                        class="betting-limit-card__actions--btn"
                        text-color="black" 
                        :label="$t('edit')" 
                        outline
                        @click="isEditDisabled = false"
                    />
                    <div v-else>
                        <q-btn 
                            class="betting-limit-card__actions--btn"
                            text-color="black" 
                            :label="$t('clear')" 
                            outline
                            @click="clearForm"
                        />
                        <q-btn 
                            class="betting-limit-card__actions--btn"
                            color="secondary" 
                            text-color="white" 
                            :label="$t('save')"
                            :disabled="!newAmount && period?.value === currentPeriod?.value"
                            @click="handleSave"
                        />
                    </div>
                </div>
            </slot>
        </div>
      </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import amountStringToObj from 'src/helpers/amountStringToObj';
import compareTotalAmounts from 'src/helpers/compareTotalAmounts';
import { useGeneralStore } from 'stores/general'

export default defineComponent({
    name: 'BettingLimitsCard',
    props: {
        title: String,
        titleIcon: String,
        tooltipIcon:{
            type: String,
            default:'info'
        },
        tooltipText: String,
        tooltipSize: String,
        disclaimerText: String,
        stickyDisclaimerText: String,
        currentLimitText: String,
        newLimitText: String,
        label: String,
        date: String,
        periodOptions: Array,
        amountOptions: Array,
        currentAmount: String,
        currentPeriod: Object,
        selectedAmount: String,
        ableTochangedAt: String,
        unit: String
    },
    emits: ['save'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const isEditDisabled = ref(true);
        const store = useGeneralStore();
        const { togglePasswordPopupDisplayed } = store;
        const period = ref(props.currentPeriod);
        
        const amountFromSelect = ref(props.selectedAmount)
        const amount = ref(props.currentAmount);

        const formDateLabel = computed(()=> (t('dateSetAt') + props.date))
        const showExtraField = computed(() => (
            amountFromSelect.value === t('otherAmount') || amountFromSelect.value === t('otherDuration')
        ))
        const newAmount = computed(() => {
            const isOther = amountFromSelect.value === t('otherAmount') || amountFromSelect.value === t('otherDuration');
            if (
                isOther && 
                amount.value !== props.currentAmount
            ) {
                return amount.value
            } else if (
                !isOther &&
                amountFromSelect.value !== props.selectedAmount
            ) {
                return amountFromSelect.value
            } else if (period.value?.value !== props.currentPeriod?.value) {
                return props.currentAmount
            }
            return null
        })
        const currentAmountDisc = computed(() => (
            t(
                `perPeriods.${props.currentPeriod.value}`, 
                {amount: props.currentAmount}
            )
        ))
        const newAmountDisc = computed(() => {
            if( props.unit === 'hours') {
                return(
                    newAmount.value.includes(':')
                    ?   t(
                            `perPeriodsTime.${period.value.value}`, 
                            {
                                hours: newAmount.value.split(':')[0], 
                                min: newAmount.value.split(':')[1]
                            }
                        )
                    :   t(
                            `perPeriods.${period.value.value}`, 
                            {amount: newAmount.value}
                        )
                )
            }
            return t(
                `perPeriods.${period.value.value}`, 
                {amount: Number(newAmount.value.match(/\d+/g)[0]) + '€'}
                
            )
        })
        const timeToBeActiveText = computed(() => {
            if (newAmount.value) {
                const newAmountToObj = amountStringToObj(newAmount.value, props.unit);
                const currentAmountToObj = amountStringToObj(props.currentAmount,props.unit);
                const textKey = 
                    compareTotalAmounts(
                        {
                            amount: currentAmountToObj.value,
                            period: props.currentPeriod.value
                        },
                        {
                            amount: newAmountToObj.value,
                            period: period.value.value
                        }
                    )
                return textKey ? t(`effectAt.${textKey}`, {date: props.ableTochangedAt}) : null;

            }
            return null;
        })

        const clearForm = () => {
            isEditDisabled.value = true;
            period.value = props.currentPeriod;
            amountFromSelect.value = props.selectedAmount;
            amount.value = props.currentAmount;
        }

        const handleSave = () => {
            togglePasswordPopupDisplayed(() => {
                emit('save',{
                    newAmount: amountStringToObj(newAmount.value,props.unit),
                    newPeriod: period.value.value,
                    savedAt: new Date().toISOString()
                })
                isEditDisabled.value = true;
            });
        }
        
        return {
            isEditDisabled,
            formDateLabel,
            period,
            amountFromSelect,
            showExtraField,
            amount,
            newAmount,
            currentAmountDisc,
            newAmountDisc,
            timeToBeActiveText,
            clearForm,
            handleSave
        }
    }
})
</script>

<style lang="scss">
.betting-limit-card {
    &__title {
        display: flex;
        align-items: center;
        &--text {
            font-size: $lg;
            font-weight: normal;
            margin-top: 0;
            margin-bottom: 0;
        }
        &--icon {
            opacity: .87;
            border-radius: 24px;
            background-color: #0066CC;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            flex: 0 0 auto;
        }
    }

    &__actions {
        border-top: 1px solid #eceff1;
        padding-top: $xxs;
        &--disc {
            font-size: $xs;
            color: $warning;
        }
        &--current-limit-title, --new-limit-title {
            font-size: $xs;
            font-weight: bold;
        }
        &--current-limit-text, --new-limit-text {
            font-size: $xs;
            font-weight: normal;
            margin-left: 5px;
        }
        &--btn {
            text-transform: none;
            font-weight: normal;
            padding-left: $xxxl;
            padding-right: $xxxl;
            margin-right: 5px;
            margin-top: $xxs;
        }
    }

    &__form {
        &--label {
            display: flex;
            justify-content: space-between;
            font-size: $sm;
            &-date {
                color: $dark;
                opacity: 0.55;
            }
        }
        &--fields {
            display: flex;
            justify-content: space-between;
            &-select {
                flex-grow: 0.49;
            }
            
        }
    }
}
@media (max-width: $breakpoint-xs-max) {

    .q-card__section--vert {
        padding: $xxs;
    }
}
</style>