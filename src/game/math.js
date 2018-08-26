export function mid(...nums) {
    nums.sort((a,b)=>a-b);
    const half = Math.floor(nums.length / 2);
    if (nums.length % 2 === 0) {
        return (nums[half - 1] + nums[half]) / 2;
    } else {
        return nums[half];
    }
}

export function clamp(value, absMax) {
    return mid(absMax, -absMax, value);
}
