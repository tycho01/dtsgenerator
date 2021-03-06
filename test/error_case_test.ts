require('source-map-support').install();

import * as assert from 'power-assert';
import dtsgenerator from '../src/';


describe('error schema test', () => {

    it('no id schema', async () => {
        const schema: Schema = {
            type: 'object',
        };
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal('There is no id in the input schema(s)', e.message);
        }
    });
    it('unkown type schema', async () => {
        const schema: any = {
            id: '/test/unkown_type',
            type: 'hoge'
        };
        try {
            await dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('unsupported root type: "hoge"', e.message);
        }
    });
    it('unkown type property', async () => {
        const schema: any = {
            id: '/test/unkown_property',
            type: 'object',
            properties: {
                name: {
                    type: 'fuga'
                }
            }
        };
        try {
            await dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('unknown type: fuga', e.message);
        }
    });

    it('target of $ref is not found', async () => {
        const schema: Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '/notFound/id#'
                }
            }
        };
        try {
            await dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('$ref target is not found: /notFound/id#', e.message);
        }
    });
    it('target of $ref is invalid path', async () => {
        const schema: Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '#hogefuga'
                }
            }
        };
        try {
            await dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('$ref target is not found: /test/target_not_found#hogefuga', e.message);
        }
    });

});

