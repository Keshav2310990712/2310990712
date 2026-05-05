function getTopNotifications(list) {

    function getTypeWeight(type) {
        if (type === "Placement") return 3;
        if (type === "Result") return 2;
        return 1; // Event
    }

    return list
        .map(n => {
            const typeWeight = getTypeWeight(n.type);
            const timeWeight = n.timestamp;

            return {
                ...n,
                score: typeWeight * 1000000000 + timeWeight
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

module.exports = getTopNotifications;