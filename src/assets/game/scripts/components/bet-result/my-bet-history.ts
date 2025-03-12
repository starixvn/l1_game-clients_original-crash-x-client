import { _decorator, CCInteger, Component, Node, Prefab, UITransform, instantiate, Label } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('MyBetHistory')
export class MyBetHistory extends Component {
    
    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    itemPrefab: Prefab = null;

    @property({ type: CCInteger })
    loadThreshold: number = 50;

    @property({ type: CCInteger })
    totalItems: number = 100;

    @property({ type: CCInteger })
    startYPosition: number = -20;

    @property({ type: CCInteger })
    itemHeight: number = 100;

    private stepItems: number = 20;
    private currentItem: number = 20;


    protected onLoad() {
        this.itemHeight = this.itemPrefab.data.height;  // Get the height of the item
        //this.items = [];  // Keep track of the created items
        this.content.getComponent(UITransform).height = this.totalItems * this.itemHeight; 
        this.loadItems();  // Initially load the items
        this.node.on('scrolling', this.onScrolling, this);
    }

    onScrolling(event) {

       
        const contentY = event.content.getPosition().y; 
console.log('contentY', contentY);
console.log('window.innerHeight', window.innerHeight);
console.log('this.content.getComponent(UITransform).height', this.content.getComponent(UITransform).height);


//const scrollViewHeight = this.scrollView.node.height;


// Check if the ScrollView is scrolled to the bottom
const scrollPosition = this.content.position;


        // Check if we've reached the threshold at the bottom of the scroll view
       
        if (contentY <= -this.loadThreshold) {
            this.addItemsToTop(); // Add items to the top when we reach the bottom
        }
        // Check if we've reached the threshold at the top of the scroll view

       else if (contentY >= this.content.getComponent(UITransform).height - 180) {
        //else if (contentY >= this.content.getComponent(UITransform).height - window.innerHeight + this.loadThreshold) {
            this.addItemsToBottom(); // Add items to the bottom when we reach the top
        }
        
    }

    loadItems() {
        for (let i = 0; i < this.totalItems; i++) {
            let item = instantiate(this.itemPrefab); 
            this.content.addChild(item);  
            item.getComponentInChildren(Label).string = "Item + " +   (i + 1).toString() ;
            
            
            let currentPosition = item.getPosition();
            let y = this.startYPosition - (i * this.itemHeight);
            console.log(y);
            item.setPosition(currentPosition.x, y);

            //this.items.push(item); // Keep track of the item
        }
    }

    addItemsToTop() {
        console.log('addItemsToTop');
        /*
        let firstItem = this.items[0];
        this.items.shift(); // Remove the first item from the array

        // Move the first item to the bottom
        firstItem.y = this.items[this.items.length - 1].y - this.itemHeight;
        this.items.push(firstItem); // Add it back at the end of the array

        // Optionally, update the label or content here
        firstItem.getComponentInChildren(cc.Label).string = `Item ${this.items.length + 1}`;*/
    }

    // This method adds items to the bottom of the list
    addItemsToBottom() {
        console.log('addItemsToBottom');


        /*
        let lastItem = this.items[this.items.length - 1];
        this.items.pop(); // Remove the last item from the array

        // Move the last item to the top
        lastItem.y = this.items[0].y + this.itemHeight;
        this.items.unshift(lastItem); // Add it at the start of the array

        // Optionally, update the label or content here
        lastItem.getComponentInChildren(cc.Label).string = `Item ${this.items.length + 1}`;
        */

        let currentItem = this.totalItems;
        
        
        for (let i = 0; i < this.stepItems; i++) {
            currentItem++;
            let item = instantiate(this.itemPrefab); 
            this.content.addChild(item);  
            item.getComponentInChildren(Label).string = "Item + " +   (i + 1).toString() ;
            
            
            let currentPosition = item.getPosition();
            let y =  -(currentItem * this.itemHeight);
            console.log(y);
            item.setPosition(currentPosition.x, y);


            //this.items.push(item); // Keep track of the item
        }

        this.totalItems += this.stepItems;
        this.content.getComponent(UITransform).height = this.totalItems * this.itemHeight; 

        console.log(this.totalItems);

    }
}


