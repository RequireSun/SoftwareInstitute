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
        changed : false,
    }, action) => {
    switch (action.type) {
        case 'STRUCT_INIT': {
            const {category, outline, all} = action['data'];
            let result = {};
            !!category && (result['category'] = Immutable.fromJS(category));
            !!outline && (result['outline'] = Immutable.fromJS(outline));
            !!all && (result['all'] = Immutable.fromJS(all));
            !!all && (result['original'] = Immutable.fromJS(all));
            return result;
        }
        case 'STRUCT_CREATE': {
            const { outlineId, name } = action['data'];
            if (!name) {
                return state;
            }
            if (!!outlineId || 0 == outlineId) {
                let outlineIndex = state['all'].findKey(item => outlineId == item.get('id'));

                let ids   = state['all'].
                                map(item => item.get('categories')).
                                reduce((prev, cur) => prev.concat(cur), Immutable.List()).
                                map(item => item.get('id')).
                                sort((a, b) => a - b),
                    idKey = (ids.findKey((item, index) =>
                                item != (index + 1) &&
                                !ids.find(item => item == index + 1)) || ids.size) + 1;

                state['all'] = state['all'].updateIn([outlineIndex, 'categories'], value => value.push(Immutable.Map({ id: idKey, name })));
            } else {
                // 默认数据库的 id 从 1 开始
                let ids   = state['all'].map(item => item.get('id')).sort((a, b) => a - b).toList(),
                    idKey = (ids.findKey((item, index) =>
                                item != (index + 1) &&
                                !ids.find(item => item == index + 1)) || ids.size) + 1;

                state['all'] = state['all'].set(idKey, Immutable.Map({ id: idKey, name, categories: Immutable.List()}));
            }
            return Object.assign({}, state);
        }
        case 'STRUCT_RENAME': {
            const { outlineId, categoryId, name } =  action['data'];
            if ((!outlineId && 0 != outlineId) || !categoryId) {
                return state;
            }
            const outlineIndex = state['all'].findKey(item => outlineId == item.get('id'));
            if (!!categoryId) {
                let categoryIndex = state['all'].getIn([outlineIndex, 'categories']).findKey(item => categoryId == item.get('id'));
                state['all'] = state['all'].updateIn([outlineIndex, 'categories', categoryIndex, 'name'], oldName => name);
                return Object.assign({}, state);
            } else {
                state['all'] = state['all'].update(outlineIndex, value => value.set('name', name));
                return Object.assign({}, state);
            }
        }
        case 'STRUCT_DELETE': {
            const { outlineId, categoryId } =  action['data'];
            if (!outlineId && 0 != outlineId) {
                return state;
            }
            const outlineIndex = state['all'].findKey(item => outlineId == item.get('id'));
            if (!!categoryId) {
                let categoryIndex = state['all'].getIn([outlineIndex, 'categories']).findKey(item => categoryId == item.get('id'));
                state['all'] = state['all'].deleteIn([outlineIndex, 'categories', categoryIndex]);
                // return Object.assign({}, state);
            } else {
                state['all'] = state['all'].delete(outlineIndex);
            }
            return Object.assign({}, state);
        }
        case 'STRUCT_MOVE': {
            const { originId, targetId, categoryId } = action['data'];
            if ((!originId && 0 != originId) || (!targetId && 0 != targetId) || !categoryId) {
                return state;
            }
            const originIndex   = state['all'].findKey(item => originId == item.get('id')),
                  targetIndex   = state['all'].findKey(item => targetId == item.get('id')),
                  categoryIndex = state['all'].getIn([originIndex, 'categories']).findKey(item => categoryId == item.get('id')),
                  categoryItem  = state['all'].getIn([originIndex, 'categories', categoryIndex]);

            state['all'] = state['all'].updateIn([targetIndex, 'categories'], value => value.push(categoryItem));
            state['all'] = state['all'].deleteIn([originIndex, 'categories', categoryIndex]);
            return Object.assign({}, state);
    }
        default:
            return state;
    }
});