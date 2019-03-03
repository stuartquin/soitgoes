export const getModifierDisplayName = (modifier) => {
  return modifier.percent ?
    `${modifier.name} ${modifier.percent}%` :
    modifier.name;
};

export const getModifierImpact = (modifier, subTotal) => {
  return modifier.percent ?
    (subTotal / 100 * modifier.percent) :
    modifier + modifier.percent;
};
