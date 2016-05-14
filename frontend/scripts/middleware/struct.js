/**
 * Created by kelvinsun on 2016/5/13.
 */
define(['immutable'], Immutable => store => next => action => {
    const result = next(action);

    let struct = store.getState()['struct'];
    if (!!struct && !!struct['all'] && !!struct['original']) {
        struct['changed'] = !(struct['all'] === struct['original'] ||
                             Immutable.is(struct['all'], struct['original']));
    }

    return result;
});