export const validateInteger = {
	validator: Number.isInteger,
	message: '{VALUE} is not an integer value',
};

export const validateAddOrDel = {
	validator: (v: unknown) => {
		if (v !== 'add' && v !== 'del') return false;
		return true;
	},
	message: '{VALUE} is not add OR del',
};

export const validateCurrency = {
	validator: (v: unknown) => {
		if (v !== 'coin' && v !== 'gem') return false;
		return true;
	},
	message: '{VALUE} is not coin OR gem',
};

export const validatePetModifier = {
	validator: (v: unknown) => {
		if (v !== 'NONE' && v !== 'SHINY') return false;
		return true;
	},
	message: '{VALUE} is not a valid modifier',
};