import { InputValueItem } from '../../../../../assets/game/scripts/components/new/input-value-item';
import { Label, Node } from 'cc';
import gc from '@sg/game-client-base';

const { FormatUtils } = gc;

jest.mock('@sg/game-client-base', () => ({
    FormatUtils: {
        numberWithCommas: jest.fn((value) => value.toString())
    }
}));

describe('InputValueItem', () => {
    let component: InputValueItem;
    let mockLabel: Label;

    beforeEach(() => {
        mockLabel = new Label();
        component = new InputValueItem();
        component.label = mockLabel;
        component.node = new Node();
        component.getComponentInChildren = jest.fn().mockReturnValue(mockLabel);
    });

    describe('fetchLabel', () => {
        it('should fetch label from children', () => {
            component.fetchLabel();
            expect(component.getComponentInChildren).toHaveBeenCalledWith(Label);
            expect(component.label).toBe(mockLabel);
        });
    });

    describe('setValue', () => {
        it('should set formatted value to label', () => {
            const mockValue = 1000;
            component.setValue(mockValue);

            expect(FormatUtils.numberWithCommas).toHaveBeenCalledWith(mockValue);
        });

        it('should set value to label', () => {
            const mockValue = 1000;
            component.setValue(mockValue);
            expect(component.label.string).toBe(mockValue.toString());
        });
    });
});
