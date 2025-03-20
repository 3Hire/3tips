const { createApp, ref } = Vue;

createApp({
    setup() {
        const title = ref('3Hire Candidate Management');
        const items = ref([
            'Review new candidate applications',
            'Schedule technical interview for John Doe',
            'Follow up with HR about offer letter'
        ]);
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