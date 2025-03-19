const { createApp, ref } = Vue;

createApp({
    setup() {
        const title = ref('Reactive To-Do List');
        const items = ref([]);
        const newItem = ref('');

        function addItem() {
            if (newItem.value.trim()) {
                items.value.push(newItem.value);
                newItem.value = '';
            }
        }

        function removeItem(index) {
            items.value.splice(index, 1);
        }

        return {
            title,
            items,
            newItem,
            addItem,
            removeItem
        };
    }
}).mount('#app');