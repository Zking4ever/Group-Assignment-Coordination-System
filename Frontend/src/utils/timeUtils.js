export const formatRelativeDeadline = (dateString) => {
    if (!dateString) return "No deadline set";

    const deadline = new Date(dateString);
    const now = new Date();
    const diffInMs = deadline - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMs < 0) {
        return "Deadline passed";
    }

    if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
            const diffInMins = Math.floor(diffInMs / (1000 * 60));
            return diffInMins > 0 ? `${diffInMins} minutes left` : "Ending now";
        }
        return `${diffInHours} hours left`;
    }

    if (diffInDays === 1) {
        return "Tomorrow";
    }

    if (diffInDays < 7) {
        return `${diffInDays} days for deadline`;
    }

    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? "1 week left" : `${weeks} weeks left`;
    }

    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month left" : `${months} months left`;
};
