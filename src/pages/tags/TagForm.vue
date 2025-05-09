<script setup>
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { Notify, uid } from 'quasar';
import { useTransactionsStore } from '@/stores/transactions';

const transactionsStore = useTransactionsStore();

const router = useRouter();

const quasarColors = ref([
    { name: 'red', label: 'Red' },
    { name: 'pink', label: 'Pink' },
    { name: 'purple', label: 'Purple' },
    { name: 'deep-purple', label: 'Deep Purple' },
    { name: 'indigo', label: 'Indigo' },
    { name: 'blue', label: 'Blue' },
    { name: 'light-blue', label: 'Light Blue' },
    { name: 'cyan', label: 'Cyan' },
    { name: 'teal', label: 'Teal' },
    { name: 'green', label: 'Green' },
    { name: 'light-green', label: 'Light Green' },
    { name: 'lime', label: 'Lime' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'amber', label: 'Amber' },
    { name: 'orange', label: 'Orange' },
    { name: 'deep-orange', label: 'Deep Orange' },
    { name: 'brown', label: 'Brown' },
    { name: 'grey', label: 'Grey' },
    { name: 'blue-grey', label: 'Blue Grey' },
    { name: 'primary', label: 'Primary' },
    { name: 'secondary', label: 'Secondary' },
    { name: 'accent', label: 'Accent' },
    { name: 'dark', label: 'Dark' },
    { name: 'positive', label: 'Positive' },
    { name: 'negative', label: 'Negative' },
    { name: 'info', label: 'Info' },
    { name: 'warning', label: 'Warning' }
])

const colorOptions = computed(() => {
    return quasarColors.value.map(color => ({
        label: color.label,
        value: color.name
    }))
})

const tagTypes = ref([
    { name: 'expense', label: 'Expense' },
    { name: 'income', label: 'Income' },
])

const tagOptions = computed(() => {
    return tagTypes.value.map(tag => ({
        label: tag.label,
        value: tag.name
    }))
})

const tagName = ref("");
const tagType = ref("");
const tagColor = ref("");

function handleSubmit() {
    try {
        transactionsStore.addTag({
            id: uid(),
            name: tagName.value,
            type: tagType.value,
            color: tagColor.value,
        })

        router.push('/tags');

        Notify.create({
            message: 'Transaction Added Successfully',
            type: "positive",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })

    } catch (error) {
        Notify.create({
            message: error.message,
            type: "negative",
            actions: [
                { icon: 'close', color: 'white', round: true, }
            ]
        })
    }
}
</script>

<template>
    <q-page class="flex items-center column q-my-lg">
        <q-card flat bordered class="form-card">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6 q-mb-md">Add Tag</div>
                <q-space />
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent="handleSubmit">
                    <q-input filled v-model="tagName" label="Tag Name" required lazy-rules
                        :rules="[val => val && val.length > 0 || 'Tag Name is required']" autofocus />

                    <q-select class="q-my-md" v-model="tagType" :options="tagOptions" label="Select a Type" emit-value
                    map-options>
                    </q-select>

                    <q-select class="q-my-md" v-model="tagColor" :options="colorOptions" label="Select a color" emit-value
                        map-options>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section avatar>
                                    <q-icon name="palette" :color="scope.opt.value" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn type="submit" fab icon="done" color="primary">
                        </q-btn>
                    </q-page-sticky>

                    <q-page-sticky position="bottom-left" :offset="[18, 18]">
                        <q-btn :to="{ 'name': 'tags' }" fab icon="undo" color="negative">
                        </q-btn>
                    </q-page-sticky>
                </q-form>
            </q-card-section>

        </q-card>
    </q-page>
</template>
<style lang="sass">
.form-card
  width: 100%
  max-width: 400px
</style>