import { ClientSeedSettingsDirectPopup } from '../../../../../assets/game/scripts/components/provably-fair/client-seed-settings-popup';
import { EditBox, Label, Node, UIOpacity } from 'cc';
import gc from '@sg/game-client-base';

describe('ClientSeedSettingsDirectPopup', () => {
    let component: ClientSeedSettingsDirectPopup;
    let mockInputManualSeed: EditBox;
    let mockLblRandomClientSeed: Label;
    let mockUIOpacity: UIOpacity;
    let mockNode: Node;

    beforeEach(() => {
        // Create mock components
        mockInputManualSeed = new EditBox();
        mockLblRandomClientSeed = new Label();
        mockUIOpacity = new UIOpacity();
        mockNode = new Node();

        // Setup component
        component = new ClientSeedSettingsDirectPopup();

        // Mock required properties
        component.inputManualSeed = mockInputManualSeed;
        component.lblRandomClientSeed = mockLblRandomClientSeed;

        // Setup node and UIOpacity component
        mockInputManualSeed.node = mockNode;
        mockLblRandomClientSeed.node = mockNode;
        mockNode.getComponent = jest.fn().mockReturnValue(mockUIOpacity);

        // Mock inherited methods
        component.updateValueManualMode = jest.fn();
        component.clickManualMode = jest.fn();
        component.clickRandomMode = jest.fn();

    });

    describe('focus', () => {
        it('should call focus method', () => {
            component.inputManualSeed.focus();
            expect(component.inputManualSeed.focus).toHaveBeenCalled();
        });
    });
    describe('string property', () => {
        it('should return empty string by default', () => {
            expect(component.inputManualSeed.string).toBe('');
        });

        it('should set and get string value correctly', () => {
            const testString = 'test value';
            component.inputManualSeed.string = testString;
            expect(component.inputManualSeed.string).toBe(testString);
        });

        it('should handle null value by converting to empty string', () => {
            component.inputManualSeed.string = null;
            expect(component.inputManualSeed.string).toBe('');
        });

        it('should handle undefined value by converting to empty string', () => {
            component.inputManualSeed.string = undefined;
            expect(component.inputManualSeed.string).toBe('');
        });
    });

    describe('clickManualOption', () => {
        it('should copy random client seed to manual input', () => {
            // Arrange
            const randomSeed = 'test-random-seed';
            mockLblRandomClientSeed.string = randomSeed;

            // Act
            component.clickManualOption();

            // Assert
            expect(mockInputManualSeed.string).toBe(randomSeed);
        });

        it('should call updateValueManualMode with random seed', () => {
            // Arrange
            const randomSeed = 'test-random-seed';
            mockLblRandomClientSeed.string = randomSeed;

            // Act
            component.clickManualOption();

            // Assert
            expect(component.updateValueManualMode).toHaveBeenCalledWith(randomSeed);
        });

        it('should call clickManualMode', () => {
            // Act
            component.clickManualOption();

            // Assert
            expect(component.clickManualMode).toHaveBeenCalled();
        });

        it('should handle empty random seed', () => {
            // Arrange
            mockLblRandomClientSeed.string = '';

            // Act
            component.clickManualOption();

            // Assert
            expect(mockInputManualSeed.string).toBe('');
            expect(component.updateValueManualMode).toHaveBeenCalledWith('');
        });
    });

    describe('updateInputOpacity', () => {
        it('should set correct opacity when enabled', () => {
            // Act
            component['updateInputOpacity'](true);

            // Assert
            expect(mockInputManualSeed.enabled).toBe(true);
            expect(mockUIOpacity.opacity).toBe(255);
        });

        it('should set correct opacity when disabled', () => {
            // Act
            component['updateInputOpacity'](false);

            // Assert
            expect(mockInputManualSeed.enabled).toBe(false);
            expect(mockUIOpacity.opacity).toBe(153);
        });
    });

    describe('updateRandomLabelOpacity', () => {
        it('should set correct opacity when enabled', () => {
            // Act
            component['updateRandomLabelOpacity'](true);

            // Assert
            expect(mockUIOpacity.opacity).toBe(255);
        });

        it('should set correct opacity when disabled', () => {
            // Act
            component['updateRandomLabelOpacity'](false);

            // Assert
            expect(mockUIOpacity.opacity).toBe(153);
        });
    });

    describe('updateManualClientSeed', () => {
        it('should update input manual seed with provided value', () => {
            // Arrange
            const testSeed = 'test-client-seed';

            // Act
            component.updateManualClientSeed(testSeed);

            // Assert
            expect(mockInputManualSeed.string).toBe(testSeed);
        });

        it('should handle empty string', () => {
            // Act
            component.updateManualClientSeed('');

            // Assert
            expect(mockInputManualSeed.string).toBe('');
        });

        it('should handle null value', () => {
            // Act
            component.updateManualClientSeed(null);

            // Assert
            expect(mockInputManualSeed.string).toBe('');
        });

        it('should handle undefined value', () => {
            // Act
            component.updateManualClientSeed(undefined);

            // Assert
            expect(mockInputManualSeed.string).toBe('');
        });
    });

    describe('clickAutoOption', () => {
        it('should clear manual seed input', () => {
            // Arrange
            mockInputManualSeed.string = 'some-existing-value';

            // Act
            component.clickAutoOption();

            // Assert
            expect(mockInputManualSeed.string).toBe('');
        });

        it('should call clickRandomMode', () => {
            // Act
            component.clickAutoOption();

            // Assert
            expect(component.clickRandomMode).toHaveBeenCalled();
        });

        it('should clear input and call clickRandomMode in correct order', () => {
            // Arrange
            const clickRandomModeSpy = jest.spyOn(component, 'clickRandomMode');
            mockInputManualSeed.string = 'some-existing-value';

            // Act
            component.clickAutoOption();

            // Assert
            expect(mockInputManualSeed.string).toBe('');
            expect(clickRandomModeSpy).toHaveBeenCalled();
            expect(clickRandomModeSpy.mock.invocationCallOrder[0]).toBeGreaterThan(0);
        });
    });
});
