import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import mainApi from 'src/api/mainApi';

export const useGeneralStore = defineStore('general', () => {
  const { t } = useI18n()
  const passwordPopupDisplayed = ref(false);
  const passwordPopupCallback = ref(null);

  const checkAuthentication = async (password) => {
    try {
        const response = await mainApi.get('/user');
        return password === response.data.password
    } catch (err) {
        console.error(err);
        return false;
    }
  }
  
  const togglePasswordPopupDisplayed = (callback) => {
    passwordPopupDisplayed.value = !passwordPopupDisplayed.value
    if (callback)
        passwordPopupCallback.value = callback;
    
  }

  return {
    passwordPopupDisplayed,
    passwordPopupCallback,
    togglePasswordPopupDisplayed,
    checkAuthentication
  }
})
