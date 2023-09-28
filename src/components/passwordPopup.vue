<template>
    <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="prompt" persistent position="top">
            <q-card class="password-popup">
                <q-bar dark class="justify-end">
                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>{{ $t('close') }}</q-tooltip>
                    </q-btn>
                </q-bar>
                <q-card-section>
                    <div class="password-popup__icon">
                        <q-icon name="key" size="sm" color="white"/>
                    </div>
                    <p class="q-mt-md text-center">
                        {{ $t('passwordPopup.text') }}
                    </p>
                </q-card-section>
    
                <q-card-section class="q-pt-none">
                    <label class="text-bold">{{ $t('passwordPopup.password') }}</label>
                    <q-input 
                        class="password-popup__input"
                        v-model="password" 
                        :type="isPwd ? 'password' : 'text'"
                        dense
                        autofocus
                        outlined 
                        @focus="hasError = false"
                        :error="hasError"
                        :error-message="$t('passwordPopup.invalidPassword')"
                    >
                        <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                        </template>
                    </q-input>
                </q-card-section>
    
                <q-card-actions align="center" class="text-primary q-mb-sm">
                    <q-btn 
                        class="password-popup__btn"
                        :label="$t('passwordPopup.confirmPassword')" 
                        color="dark"
                        @click="handleSubmit" 
                        :disabled="!password"
                    />
                </q-card-actions>
                <p class="text-center text-red">Για δοκιμή το password είναι 123456</p>
            </q-card>
        </q-dialog>
    </div>
  </template>
  
<script>
import { ref, defineComponent } from 'vue'
import { useGeneralStore } from 'src/stores/general'
import { storeToRefs } from 'pinia'

export default defineComponent({
    name: 'PasswordPopup',
    setup () {
        const store = useGeneralStore();
        const { 
            togglePasswordPopupDisplayed,
            checkAuthentication
        } = store;
        const { 
            passwordPopupDisplayed: prompt, 
            passwordPopupCallback: callback 
        } = storeToRefs(store);

        const password = ref('')
        const isPwd = ref(true)
        const hasError = ref(false)

        const handleSubmit = async () => {
            const userValid = await checkAuthentication(password.value)
            if (userValid) {
                togglePasswordPopupDisplayed()
                if (callback.value) callback.value() 
            } else {
                hasError.value = true;
            }
        }
        return {
            prompt,
            callback,
            password,
            isPwd,
            hasError,
            handleSubmit
        }
    }
})
</script>

<style lang="scss">

.password-popup {
    min-width: 320px;
    top: 50px;
    &__icon {
        opacity: .87;
        border-radius: 24px;
        background-color: #0066CC;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
        flex: 0 0 auto;
    }
    &__btn {
        text-transform: none;
    }
    .q-field__control {
        margin-top: $xxs;
        border-radius: $xs;
    }
}
</style>
  