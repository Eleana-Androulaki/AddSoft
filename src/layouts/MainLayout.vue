<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Add Soft
        </q-toolbar-title>

        
        <q-select 
          v-model="lang" 
          :options="langs" 
        >
          <template v-slot:selected>
            <span>{{ langsIcons.find(ic => ic.value === lang).icon }}</span>
          </template>
        </q-select>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <PasswordPopup v-if="passwordPopupDisplayed"/>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PasswordPopup from 'src/components/passwordPopup.vue'
import { useGeneralStore } from 'stores/general.js';
import { storeToRefs } from 'pinia';


export default defineComponent({
  name: 'MainLayout',
  components: {
    PasswordPopup
  },
  setup () {
    const { locale } = useI18n()
    const store = useGeneralStore();
    const { passwordPopupDisplayed } = storeToRefs(store);
    const lang = ref(locale.value)
    const langs = ['gr']
    const langsIcons = [
      {
        value: 'gr',
        icon: '🇬🇷'
      }
    ]

    watch(lang, (newLang, oldLang) => {
      locale.value = newLang
    })

    return {
      langs,
      langsIcons,
      lang,
      passwordPopupDisplayed
    }
  }
})
</script>
