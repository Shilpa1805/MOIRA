const DB = {
    myId: 'me',
    friends: [
        { id: 'u1', name: 'Liam', avatar: 'https://i.pravatar.cc/150?u=12', itemsCount: 14 },
        { id: 'u2', name: 'Maya', avatar: 'https://i.pravatar.cc/150?u=18', itemsCount: 8 },
        { id: 'u3', name: 'Cristina', avatar: 'https://i.pravatar.cc/150?u=33', itemsCount: 21 },
        { id: 'u4', name: 'Nik', avatar: 'https://i.pravatar.cc/150?u=44', itemsCount: 5 },
        { id: 'u5', name: 'Demi', avatar: 'https://i.pravatar.cc/150?u=55', itemsCount: 12 }
    ],
    items: {
        'me': [
            { id: 'm1', name: 'White Tee', img: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-white-t-shirt-png-image_10014075.png', owner: 'ME' },
            { id: 'm2', name: 'Black Jeans', img: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-black-jeans-png-image_10014076.png', owner: 'ME' }
        ],
        'u1': [
            { id: 'cl1', name: 'Denim Jacket', img: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-denim-jacket-png-image_10014072.png', owner: 'LIAM' },
            { id: 'cl2', name: 'Leather Jacket', img: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-leather-jacket-png-image_10014073.png', owner: 'LIAM' },
            { id: 'cl3', name: 'Maroon Hoodie', img: 'https://png.pngtree.com/png-clipart/20230916/ourmid/pngtree-maroon-hoodie-png-image_10091811.png', owner: 'LIAM' },
            { id: 'cl4', name: 'Blue Overshirt', img: 'https://png.pngtree.com/png-clipart/20230914/ourmid/pngtree-blue-denim-shirt-png-image_10014074.png', owner: 'LIAM' }
        ],
        'u2': [
             { id: 'cl5', name: 'Black Blazer', img: 'https://png.pngtree.com/png-clipart/20231018/ourmid/pngtree-black-blazer-png-image_10200878.png', owner: 'MAYA' },
            { id: 'cl6', name: 'Opera Mauve Coat', img: 'https://png.pngtree.com/png-clipart/20230918/ourmid/pngtree-red-coat-png-image_10100778.png', owner: 'MAYA' }
        ]
    }
};

const app = {
    currentFriendId: 'u1',

    init() {
        const pageId = document.body.id;
        
        if (pageId === 'page-circles') {
            this.renderAvatars();
            this.renderFriendWardrobe(this.currentFriendId);
        } else if (pageId === 'page-closet') {
            this.renderMyWardrobe();
        } else if (pageId === 'page-stylist') {
            this.setupStylist();
        }
    },

    renderAvatars() {
        const container = document.getElementById('top-avatars');
        if(!container) return;
        container.innerHTML = DB.friends.map(f => `
            <div class="avatar-col ${f.id === this.currentFriendId ? 'active' : ''}" onclick="app.selectFriend('${f.id}')">
                <img src="${f.avatar}" alt="${f.name}">
                <span>${f.name.substring(0,8)}</span>
            </div>
        `).join('');
    },

    selectFriend(friendId) {
        this.currentFriendId = friendId;
        this.renderAvatars();
        this.renderFriendWardrobe(friendId);
    },

    renderFriendWardrobe(friendId) {
        const friend = DB.friends.find(f => f.id === friendId);
        const alertEl = document.getElementById('current-friend-alert');
        const nameEl = document.getElementById('current-friend-name');
        if(alertEl) alertEl.innerText = friend.name;
        if(nameEl) nameEl.innerText = friend.name;
        
        const items = DB.items[friendId] || [];
        const countEl = document.getElementById('item-count');
        if(countEl) countEl.innerText = items.length;

        const grid = document.getElementById('wardrobe-grid');
        if(grid) {
            grid.innerHTML = items.length ? items.map(item => this.createItemCard(item)).join('') 
                            : '<p style="grid-column: span 2; opacity: 0.5;">No items shared currently.</p>';
        }
    },

    renderMyWardrobe() {
        const grid = document.getElementById('my-wardrobe-grid');
        if(!grid) return;
        const items = DB.items['me'];
        grid.innerHTML = items.map(item => this.createItemCard(item, false)).join('');
    },

    createItemCard(item, showTryOn = true) {
        return `
        <div class="item-card">
            <div class="item-img-box">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="item-name">${item.name}</div>
            <div class="item-footer">
                <span class="item-owner">OWNER: ${item.owner}</span>
                ${showTryOn ? `<button class="btn-try-on" onclick="app.openTryOnModal('${item.img}')">TRY ON</button>` : ''}
            </div>
        </div>
        `;
    },

    // Modal Logistics
    openModal(modalId) {
        const overlay = document.getElementById('modal-overlay');
        if(!overlay) return;
        overlay.style.display = 'flex';
        document.querySelectorAll('.modal-card').forEach(m => m.style.display = 'none');
        document.getElementById(modalId).style.display = 'block';
    },
    
    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        if(overlay) overlay.style.display = 'none';
        
        const scene = document.getElementById('try-on-scene');
        if(scene) {
            scene.innerHTML = `<div class="spinner"><i class='bx bx-loader-alt bx-spin'></i></div><p>Generating 3D Asset...</p>`;
        }
    },

    closeModalOnOutsideClick(e) {
        if(e.target.id === 'modal-overlay') this.closeModal();
    },

    // Interactions
    openTryOnModal(imgUrl) {
        this.openModal('modal-try-on');
        const scene = document.getElementById('try-on-scene');
        if(!scene) return;
        
        // Simulate CV 2D-to-3D processing delay
        setTimeout(() => {
            scene.innerHTML = `
                <img src="${imgUrl}" style="position:absolute; width: 60%; transform: scale(1.1); filter: drop-shadow(0 0 10px rgba(0,0,0,1))">
                <span style="position:absolute; bottom:10px; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius:10px; font-size:0.7rem">Mapped to Avatar</span>
            `;
        }, 1500);
    },

    openUploadModal() {
        this.openModal('modal-upload');
    },

    requestToBorrow() {
        const nameEl = document.getElementById('current-friend-name');
        const name = nameEl ? nameEl.innerText : "Friend";
        alert("Borrow request sent! " + name + " has been notified.");
    },

    setupStylist() {
        document.querySelectorAll('.vibe-tags .pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                document.querySelectorAll('.vibe-tags .pill').forEach(p => p.classList.remove('active-vibe'));
                e.currentTarget.classList.add('active-vibe');
            });
        });
    },

    generateOutfit(event) {
        const btn = event.currentTarget;
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> AI Scanning Closet...";
        
        const friendItems = DB.items['u1']; // Mocking Liam's items as the shared pool
        
        setTimeout(() => {
            btn.innerHTML = "Generate Outfit";
            document.getElementById('outfit-result').style.display = 'block';
            
            const myItem = DB.items['me'][0]; // White tee
            const borrowedItem = friendItems[1]; // Leather jacket
            
            const grid = document.getElementById('outfit-grid');
            grid.innerHTML = this.createItemCard(myItem, false) + this.createItemCard(borrowedItem, true);
            
            const cards = grid.querySelectorAll('.item-card');
            cards[1].classList.add('highlight'); // highlight borrowed item
            const nameEl = cards[1].querySelector('.item-name');
            nameEl.innerText = nameEl.innerText + " (Suggested)";

        }, 1500);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
