function groupBy(array, key) {
    return array.reduce((acc, val) => {
        let kv = val[key];

        // Make sure dates are represented in ISO
        if (kv instanceof Date) {
            kv = kv.toISOString();
        }

        (acc[kv] = acc[kv] || []).push(val);
        return acc;
    }, {});
};

export { groupBy };