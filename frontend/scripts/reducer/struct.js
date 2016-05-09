/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define(['immutable'], Immutable =>
    (state = {
        category: Immutable.Map(),
        outline : Immutable.Map(),
        all     : Immutable.Map(),
        original: Immutable.Map(),
    }, action) => {
    switch (action.type) {
        case 'STRUCT_INIT':
            const { category, outline, all } = action['data'];
            let result = {};
            !!category && (result['category'] = Immutable.fromJS(category));
            !!outline  && (result['outline']  = Immutable.fromJS(outline));
            !!all      && (result['all']      = Immutable.fromJS(all));
            !!all      && (result['original'] = Immutable.fromJS(all));
            return result;
        case 'STRUCT_RENAME':
            // state['all'] = state['all'].updateIn(['1', 'categories', 0, 'name'], name => 'aaa');
            // state['all'] = state['all'].updateIn(['1', 'name'], name => 'aaa');
            // return Object.assign({}, state);
            const { outlineId, categoryId, name } =  action['data'];
            if (!!categoryId) {
                let outlineIndex  = state['all'].findKey(item => outlineId == item.get('id')),
                    categoryIndex = state['all'].getIn([outlineIndex, 'categories']).findKey(item => categoryId == item.get('id'));
                state['all'] = state['all'].updateIn([outlineIndex, 'categories', categoryIndex, 'name'], oldName => name);
                return Object.assign({}, state);
                // let all = state['all'].update(item => {
                //     if (outlineId == item.get('id')) {
                //         return item.update('categories', categories => {
                //             return categories.update(categoryId, category => category.set('name', name));
                //         });
                //     } else {
                //         return item;
                //     }
                // });
                // return Object.assign({}, state, { all });
            }
        // switch (type) {
            //     case 'outline':
            //         // state['all'].update()
            //         return state;
            //     case 'category':
            //     default:
                    // const outlineKey = state['all'].findKey(item =>
                    //     item.get('categories').some(item =>
                    //         +id === +item.get('id')
                    //     )
                    // );
                    // const categoryKey = state['all'].getIn([outlineKey, 'categories']).findKey(item =>
                    //     +id === +item.get('id')
                    // );
                    // state['all'] = state['all'].updateIn([outlineKey, 'categories', categoryKey], item =>
                    //     item.set('name', name)
                    // );
                    // return state;
            // }
        default:
            return state;
    }
});