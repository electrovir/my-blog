---
title: PickDeep and PickSelection
tags: [dev, TypeScript]
---

-   [`PickDeep`](https://github.com/electrovir/augment-vir/blob/a4949821f017c186918399a878c680ed5a93d189/packages/common/src/augments/object/pick-deep.ts#L72) is a utility type that expands [TypeScript's built-in `Pick` utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) to pick keys in nested objects.
-   [`PickSelection`](https://github.com/electrovir/augment-vir/blob/dev/packages/common/src/augments/object/selection-set.ts#L30) is a utility type that accomplishes the same thing but with a different interface: using selection sets (similar to GraphQL selection or Prisma's selection interface).

While both are still supported, `PickSelection` is now the recommended utility type. This blog post will explain why.

<!-- truncate -->

## What does `PickDeep` do?

As noted above, `PickDeep` is like `Pick` but supports nested objects. Below is an example demonstrating this and explaining why it's useful.

```typescript
import {PickDeep} from '@augment-vir/common';
import {assert} from 'chai';
import {test} from 'mocha';

// 1. a type with a several levels of nesting
type User = {
    name: string;
    address: {
        streetAddress: string;
        country: string;
        phoneNumber: {
            countryCode: string;
            number: string;
        };
    };
};

// 2. a function using `PickDeep`
function validateUserCountryCode(
    user: PickDeep<User, ['address', 'phoneNumber', 'countryCode']>,
): boolean {
    return !!user.address.phoneNumber.countryCode;
}

test('validateUserCountryCode', () => {
    // 3. testing the function
    assert.isTrue(
        validateUserCountryCode_PickDeep({
            address: {
                phoneNumber: {
                    countryCode: '1',
                },
            },
        }),
    );
});
```

You can try this in the TypeScript browser playground [here](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbwArAMYGsAiBTbYC+cAZlBCHAOQACAhgK4DmI2AdjALQBuwUA9KmRAQWFANwAoUJFiIaAZznZYhEmUqoAFjWBjJ4aPAQxscmCtLkKQzTV3jevOAEYAdHBpwYATzDY4Ad2AYDXc4RU4lGgAbOCjsCKi5OAgiOBYTGGAWBnFvXzgAVUUoOABeRHE4KrSaZgAuMJgoLIYJavcAEw6oEzkGhEr26tMe7BgAQS6ehQaRlrahqoE6NigvWab5wcWwDWFsADk6EAAjJX7txerl1a8AYQgO7A3m7IWr6pZjs6gXrY-8O84IDxCD7I4AExuDxEFaoTLCOB0OQtOAAAxQGBweDR4lhLHhwERnGiwA6NGMRSUDxWTXuj2wAApLsjznBMVhcGAADxUqAAGjgAG0KDQpr0KIKKLt9kdTkpJeoILS1g8nhQALoAPn54gAlA0ThAIHEaCwKu0ejA6FBzQBCO2sqAuMXdXouGXpOU-Fw3Olq7ASfDiXIZRkUElRMkU7B8mm3AOKxl6spai3VBxwADMbmMplRwT8+MJwku8mKMBcwDkABUoHQmZd2pHo5TivH-QzGQMPu1XdM+une0NPYdvmye8Pe37VQyGhQnJKm1P8Lqp8C11d8HrN1U9UH90A).

Here's what's going on in that above code.

1. We have a `User` type which contains several levels of nesting.
2. We have a function that uses `PickDeep` so its input requires only the exact data needed.
3. While testing that function, we only need to provide the data exactly needed by the function.

With just `Pick<User, 'address'>`, we would've needed to fill in both `streetAddress` and `country` in the test code.

## Limitations of `PickDeep`

### Clashing sub-keys

The most obviuos limitation of `PickDeep` is clashing sub keys. See the following example:

```typescript
import {PickDeep} from '@augment-vir/common';

type User = {
    name: string;
    company: {
        name: string;
    };
    region: {
        name: string;
        coordinates: {
            x: number;
            y: number;
        };
    };
};

const example: PickDeep<User, ['company' | 'region', 'name' | 'coordinates']> = {
    company: {
        name: 'Biz',
    },
    region: {
        name: 'Earth',
        coordinates: {
            x: 10,
            y: 5,
        },
    },
};
```

In the above example ([playground link here](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbwArAMYGsAiBTbYC+cAZlBCHAOQACAhgK4DmI2AdjALQBuwUA9KmRAQWFANwAocTACeYbHACqAZ2xQ4AXkTi4OuCxrMAXHCUwowFgwm64A8DRbTjCbTd36jJsxauud+a10obAZgYWc-Nw9sY1NzS0C3WwhoABMLGhhsJQikpIAPYxY6EAAjVUS8nSc9EvKoSpsAyObm8QEWUzhsfIMwABsYuBQMHDwAHmVVABo4AG0KOzAHaQo4AB9KYNDhClmKaLXNxZSodP0spQoAXQA+DS0bJZXcvOjjCgAhYAAvPZbppFtmEWK8ku9KABRGiwAAW-yqAjSGUuYKqcEKcAAjAAGQHo3Q1ACs+Ly+FJ-kBASAA)), if we only care about `company.name`, we still have to provide `region.name`.

### TypeScript's recursion nerfing

However, the real killer of `PickDeep` is TypeScript itself. Since my creation of `PickDeep` at the beginning of 2023, the TypeScript type checker has been repeatedly nerfed in its absility to handle recursive types. The modern `PickDeep` (which still works sometimes) has accordingly been nerfed to the point where it no longer supports auto completion in the keys array. Despite that, TypeScript _still_ frequently panics when using `PickDeep` with "type instantiation is excessively deep and possibly infinite" errors, sometimes even on objects that are obviously not possibly infinite (or even very deep).

## An alternative: `PickSelection`

Due to TypeScript's arbtirary and unpredicable "excessively deep" errors, I sought out a new means entirely of accompishing a deeply picked utility type. Thus was born `PickSelection`.

The goal of `PickSelection` is the same: allow picking arbtirary sub keys of a nested object. However, the method is totally different. Rather than accepting a list of key strings (as `PickDeep` does), it accepts a selection set. In other words, it accepts an object of booleans with keys and nestings matching exactly (with `Partial`) the original type that's being picked from. Below is an example that shows how to use `PickSelection` for all the previous `PickDeep` examples.

```typescript
import {PickSelection} from '@augment-vir/common';

// from the first PickDeep example
type User = {
    name: string;
    address: {
        streetAddress: string;
        country: string;
        phoneNumber: {
            countryCode: string;
            number: string;
        };
    };
};

function validateUserCountryCode(
    user: PickSelection<User, {address: {phoneNumber: {countryCode: true}}}>,
): boolean {
    return !!user.address.phoneNumber.countryCode;
}

// from the second PickDeep example
type User2 = {
    name: string;
    company: {
        name: string;
    };
    region: {
        name: string;
        coordinations: {
            x: number;
            y: number;
        };
    };
};

const example: PickSelection<User2, {company: {name: true}; region: {coordinates: true}}> = {
    company: {
        name: 'Biz',
    },
    region: {
        // notice that we no longer need to provide the region name property
        coordinates: {
            x: 10,
            y: 5,
        },
    },
};
```

This example ([playground link here](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbwArAMYGsDKBTANt1GYCAOwF84AzKCEOAcgAEBDAVwHMRsSYBaAN2BQA9KlohS9ANwAoGTACeYbHACqAZ2xQ4AXkQy4huCWZcAXHHUwowEu1lG4zACbOo2deosIDjo1fdsGABBV3dPCwDbe18-ODFWHigFSOtohzi4MAALUmwAOVYQACMtb1jMwwSkhQBhCGdsVJs7DMrDEiLSqGb0iscyNrhBmRGZSkTCYhI4fmZcYGdmGGwNLXrE6zqG7AAKCtZNHrgUDBx8KdIAHjWoABpEFzcPL0QcvMKSssRqrfrGizWVjYMiggB8dxkAEoLMUIBB8MwZj5HO4YKwoDMAIRYw5aAB0T3C6nx7xIBS6BN+yX+2FkZDkwmEVBodBg2RUmjEJGcJzQ6AAIthsGA4NgAB6mMD4eRKFS3ABMun0jhM5ksaVaFTE4CRKRVmTVTQ1LRiAyG7nY03KlSNvS1lTE0GctmW01eKPahnFFk6XygQ0q+r93UDRhG5tGshk3KsYsl4HwFlOWDwBCI10VDwQOrAeu8drgQJBUjglutP3hUBdJhWr2L4OVnqqtDzJH1zb8hfoACFgAAveiQgbDozl0g2zJM4wQIioFTs5ZwADuKhIEDguFI7C0xmFvJgG7ANEEjSLHLL2CtpGMphUx4gylgCn6Rid1dddcnXp9cAAjAADKOXr6gArMBfhkBBUFRkAA)) demonstrates how you can accomplish the same things as `PickDeep` with a more concise _and_ precise interface, with auto-complete support! Also, so far, TypeScript seems to be happier with `PickSelection` over `PickDeep`.
