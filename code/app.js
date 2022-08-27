const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MP3'
const cd = $(".cd")
const player = $(".player")
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
// const clickSong = $('.song')
const randomBtn = $('.btn-random')
const playlist = $(".playlist")
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "2 phút hơn",
            singer: 'Pháo',
            path: '../music/2-Phut-Hon-Remix-Remix-Phao.mp3',
            image: '../image/2-phut-hơn.jpg'
        },
        {
            name: "Chắc ai đó sẽ về",
            singer: 'Sơn Tùng MTP',
            path: '../music/Chac-Ai-Do-Se-Ve-DJ-DSmall-Remix-Son-Tung-M-TP-DJ-DSmall.mp3',
            image: '../image/chắc-ai-đó-sẽ-về.jpg'
        },
        {
            name: "Tát nước đầu đình",
            singer: 'Lynk Lee',
            path: '../music/Tat-Nuoc-Dau-Dinh-Lynk-Lee-Binz.mp3',
            image: '../image/tát-nước-đầu-đình.jpg'
        },
        {
            name: "End of Time",
            singer: 'Alan Walker',
            path: '../music/End-of-Time.mp3',
            image: '../image/end-of-time.jpg'
        },
        
        {
            name: "Hai mươi hai",
            singer: 'AMEE',
            path: '../music/22.mp3',
            image: '../image/22.jpg'
        },
        
        {
            name: "Dù cho mai về sau",
            singer: 'buitruonglinh',
            path: '../music/du-cho-mai-ve-sau.mp3',
            image: '../image/du-cho-mai-ve-sau.jpg'
        },
        {
            name: "Something just like this",
            singer: 'Coldplay, The Chainsmokers',
            path: '../music/something-just-like-this.mp3',
            image: '../image/Something_Just_Like_This.jpg'
        },
        {
            name: "2002",
            singer: 'Anne Marie',
            path: '../music/2002.mp3',
            image: '../image/2002.jpg'
        }
        
    ],
    setConfig: function(key, value){
            this.config[key] = value
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex?'active':''}" data-index = "${index}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })

        playlist.innerHTML = html.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdwidth = cd.offsetWidth
        // Xu ly CD quay/dung
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000, 
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //Xu ly phong to thu nho CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdwidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / scrollTop
            cd.style.transition = ".1s"
        }

        //Xu ly khi click Playlist
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
            audio.onplay = function(){
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing')
                cdThumbAnimate.pause()

            }
            
        }
        // Xu ly khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progresspercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progresspercent
            }
        }

        //Xu ly khi tua
        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration/100
            audio.currentTime = seekTime
        }
        //Xu ly khi next va prev bai hat
        nextBtn.onclick = function(e){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.nextSong()
            }
            audio.onplay = function(){
                    _this.isPlaying = true
                    player.classList.add('playing')
                    cdThumbAnimate.play()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }
        prevBtn.onclick = function(e){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play()
            audio.onplay = function(){
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            _this.render()
            _this.scrollToActiveSong()
            
        }
        
        // Xu ly khi an random bai hat
        randomBtn.onclick=  function(){
            _this.isRandom =! _this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xu ly next song khi het bai
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }


        // Xu ly khi an repeat
        repeatBtn.onclick = function(){
            _this.isRepeat =! _this.isRepeat
            _this.setConfig('isRandom', _this.isRandom)
            repeatBtn.classList.toggle('active', _this.isRepeat)
            
        }

        //Xu ly khi click song
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    audio.onplay = function(){
                        _this.isPlaying = true
                        player.classList.add('playing')
                        cdThumbAnimate.play()
                    }
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()

                }

                if(e.target.closest('.option')){

                }
            }
        }


    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 100)
    },
    start: function(){
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        // randomBtn.classList.toggle("active", this.isRandom);
        // repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start()