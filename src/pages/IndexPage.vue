<template>
  <q-page class="bg-accent main">
    <h1 class="q-mt-none q-ml-md text-weight-bold main__title">
      {{ $t('playerProtection') }}
    </h1>
    <q-card class="text-black q-mx-md main__card">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            v-for="{label, component} in sections"
            :key="label"
            :label="label"
          >
            <q-card>
              <q-card-section>
                <component :is="component"/>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import BettingLimits from 'components/playerProtection/bettingLimits';
import RequestCancelation from 'components/playerProtection/requestCancelation';
import TakeABreak from 'components/playerProtection/takeABreak';
import ActivityNotification from 'components/playerProtection/activityNotification';
import SelfBlocking from 'components/playerProtection/selfBlocking';
import { useI18n } from 'vue-i18n';
import { useBettingLimitsStore } from 'stores/bettingLimits.js';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { t } = useI18n();
    const store = useBettingLimitsStore();
    const { fetchDepositLimits, fetchLossLimits, fetchTimeLimits } = store;
    const sections = computed(()=>[
      {
        label: t('bettingLimits'),
        component: BettingLimits
      },
      {
        label: t('requestCancelation'),
        component: RequestCancelation
      },
      {
        label: t('takeABreak'),
        component: TakeABreak
      },
      {
        label: t('activityNotification'),
        component: ActivityNotification
      },
      {
        label: t('selfBlocking'),
        component: SelfBlocking
      }
    ])

    onMounted( async () => {
       await fetchDepositLimits();
       await fetchLossLimits();
       await fetchTimeLimits();
    })

    return {
      sections
    }
  }
})
</script>

<style lang="scss">
.main {
  &__title{
    font-size: $lg;
  }

  &__card {
    background-color: $card;
  }
}
</style>
