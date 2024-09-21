const reccurencs = [
	"daily",
	"weekly",
	"monthly",
	"quarterly",
	"semiannually",
	"annually",
];
const ROLES = {
	admin: 2005,
	supervisor: 1923,
	staff: 1001
}

const USER_ROLES = {
	'1001': { label: 'staff', value: [1001] },
	'1001,1923': { label: 'supervisor', value: [1001, 1923] },
	'staff': [1001],
	'supervisor': [1001, 1923]
}

export { reccurencs, ROLES, USER_ROLES }