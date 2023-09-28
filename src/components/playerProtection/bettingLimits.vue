<template>
    <div class="betting-limits">
        <p class="betting-limits__disc">{{ $t('bettingLimitDisclaimer') }}</p>
        <BettingLimitsCard 
            :key="depositLimits?.id"
            titleIcon = "img:/icons/pay.svg"
            tooltipIcon = "img:/icons/info.svg"
            :title = "$t('depositLimits.title')"
            :tooltipText = "$t('depositLimits.tooltipText')"
            tooltipSize = "xs"
            :disclaimerText = "$t('depositLimits.disclaimerText')"
            :currentLimitText = "$t('depositLimits.currentLimitText')"
            :newLimitText = "$t('depositLimits.newLimitText')"
            :label = "$t('depositLimits.label')"
            :date = "depositLimits?.formattedChangedAt"
            :ableTochangedAt = "depositLimits?.formattedAbleTochangedAt"
            :currentAmount="depositLimits?.currentAmount"
            :currentPeriod="depositLimits?.timePeriod"
            :periodOptions = "depositLimits?.periodOptions"
            :amountOptions = "depositLimits?.amountOptions"
            :selectedAmount = "depositLimits?.selectedAmount"
            :unit = "depositLimits?.unit"
            @save="saveDepositLimits"
        />

        <BettingLimitsCard 
            class="q-mt-lg"
            :key="lossLimits?.id"
            titleIcon = "img:/icons/wallet.svg"
            tooltipIcon = "img:/icons/info.svg"
            :title = "$t('lossLimits.title')"
            :tooltipText = "$t('lossLimits.tooltipText')"
            tooltipSize = "xs"
            :disclaimerText = "$t('lossLimits.disclaimerText')"
            :currentLimitText = "$t('lossLimits.currentLimitText')"
            :newLimitText = "$t('lossLimits.newLimitText')"
            :label = "$t('lossLimits.label')"
            :date = "lossLimits?.formattedChangedAt"
            :ableTochangedAt = "lossLimits?.formattedAbleTochangedAt"
            :currentAmount="lossLimits?.currentAmount"
            :currentPeriod="lossLimits?.timePeriod"
            :periodOptions = "lossLimits?.periodOptions"
            :amountOptions = "lossLimits?.amountOptions"
            :selectedAmount = "lossLimits?.selectedAmount"
            :unit = "lossLimits?.unit"
            @save="saveLossLimits"
        />

        <BettingLimitsCard 
            class="q-mt-lg"
            :key="timeLimits?.id"
            titleIcon = "img:/icons/clock.svg"
            tooltipIcon = "img:/icons/info.svg"
            :title = "$t('timeLimits.title')"
            :tooltipText = "$t('timeLimits.tooltipText')"
            tooltipSize = "xs"
            :stickyDisclaimerText = "$t('timeLimits.stickyDisclaimerText')"
            :disclaimerText = "$t('timeLimits.disclaimerText')"
            :currentLimitText = "$t('timeLimits.currentLimitText')"
            :newLimitText = "$t('timeLimits.newLimitText')"
            :label = "$t('timeLimits.label')"
            :date = "timeLimits?.formattedChangedAt"
            :ableTochangedAt = "timeLimits?.formattedAbleTochangedAt"
            :currentAmount="timeLimits?.currentAmount"
            :currentPeriod="timeLimits?.timePeriod"
            :periodOptions = "timeLimits?.periodOptions"
            :amountOptions = "timeLimits?.amountOptions"
            :selectedAmount = "timeLimits?.selectedAmount"
            :unit = "timeLimits?.unit"
            @save="saveTimeLimits"
        />
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import BettingLimitsCard from './bettingLimitsCard.vue';
import { useBettingLimitsStore } from 'stores/bettingLimits.js';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'BettingLimits',
    components: {
        BettingLimitsCard
    },
    setup() {
        const store = useBettingLimitsStore();
        const { editDepositLimits, editLossLimits, editTimeLimits } = store;
        const { 
            sanitizedDepositLimits: depositLimitsStore,
            sanitizedLossLimits: lossLimitsStore,
            sanitizedTimeLimits: timeLimitsStore
        } = storeToRefs(store);
        const depositLimits = computed(() => depositLimitsStore.value)
        const lossLimits = computed(() => lossLimitsStore.value)
        const timeLimits = computed(() => timeLimitsStore.value)
        
        const saveDepositLimits = (newLimits) => {
            editDepositLimits(newLimits)
        }

        const saveLossLimits = (newLimits) => {
            editLossLimits(newLimits)
        }

        const saveTimeLimits = (newLimits) => {
            editTimeLimits(newLimits)
        }

        return {
            depositLimits,
            lossLimits,
            timeLimits,
            saveDepositLimits,
            saveLossLimits,
            saveTimeLimits
        }
    }
})
</script>

<style lang="scss">
.betting-limits {
    &__disc {
        font-size: $xs;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: $sm;
    }
}
</style>