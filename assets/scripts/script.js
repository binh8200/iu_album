const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const volume = $('.control_volume-slider input')
const volumeBar = $('.control_volume-slider progress')
const volumeIcon = $('.control_volume-icon')

const PLAYER_STORAGE_KEY = 'USER_PLAYER'

const app = {
    currentIndex: 0,
    currentVolume: 100,
    isRandom: false,
    isPlaying: false,
    isRepeat: false,
    isSongactive: false,
    isMute: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Blueming',
            singer: 'IU',
            path: './assets/music/blueming.mp3',
            image: './assets/img/img_blueming.jpg',
        },
        {
            name: 'Eight',
            singer: 'IU',
            path: './assets/music/eight.mp3',
            image: './assets/img/img_eight.jpg',
        },
        {
            name: 'Celebrity',
            singer: 'IU',
            path: './assets/music/celebrity.mp3',
            image: './assets/img/img_celebrity.jpg',
        },
        {
            name: 'Love Poem',
            singer: 'IU',
            path: './assets/music/lovepoem.mp3',
            image: './assets/img/img_lovepoem.jpg',
        },
        {
            name: 'BBiBBi',
            singer: 'IU',
            path: './assets/music/bbibbi.mp3',
            image: './assets/img/img_bbibbi.jpg',
        },
        {
            name: 'above the time',
            singer: 'IU',
            path: './assets/music/abovethetime.mp3',
            image: './assets/img/img_abovethetime.jpg',
        },
        {
            name: 'LILAC',
            singer: 'IU',
            path: './assets/music/lilac.mp3',
            image: './assets/img/img_lilac.jpg',
        },
        {
            name: 'Palette',
            singer: 'IU',
            path: './assets/music/palette.mp3',
            image: './assets/img/img_palette.jpg',
        },
        {
            name: 'Strawberry moon',
            singer: 'IU',
            path: './assets/music/strawberrymoon.mp3',
            image: './assets/img/img_strawberrymoon.jpg',
        },
        {
            name: 'Twenty Three',
            singer: 'IU',
            path: './assets/music/twentythree.mp3',
            image: './assets/img/img_twentythree.jpg',
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.isMute = this.config.isMute
        this.currentVolume = this.config.currentVolume
        this.currentIndex = this.config.currentIndex
    },
    render: function () {
        const htmls = this.songs.map((songs, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${songs.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${songs.name}</h3>
                        <p class="author">${songs.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // volume update
        volume.onmousemove = function () {
            var percentVolume = volumeBar.value / 100
            _this.currentVolume = percentVolume
            audio.volume = percentVolume
            _this.setConfig('currentVolume', _this.currentVolume)
            if (audio.volume == 0) {
                _this.isMute = false
                _this.isMute = !_this.isMute
                volumeIcon.classList.toggle('mute', _this.isMute)
            } else {
                _this.isMute = true
                _this.isMute = !_this.isMute
                volumeIcon.classList.toggle('mute', _this.isMute)
            }
        }

        // volume change
        volume.onmouseup = function () {
            var percentVolume = volumeBar.value / 100
            _this.currentVolume = percentVolume
            audio.volume = percentVolume
            _this.setConfig('currentVolume', _this.currentVolume)
            if (audio.volume == 0) {
                _this.isMute = false
                _this.isMute = !_this.isMute
                _this.setConfig('isMute', _this.isMute)
                volumeIcon.classList.toggle('mute', _this.isMute)
            } else {
                _this.isMute = true
                _this.isMute = !_this.isMute
                _this.setConfig('isMute', _this.isMute)
                volumeIcon.classList.toggle('mute', _this.isMute)
            }
        }

        // change volume icon
        volumeIcon.onclick = function () {
            _this.isMute = !_this.isMute
            volumeIcon.classList.toggle('mute', _this.isMute)
            _this.setConfig('isMute', _this.isMute)
            if (_this.isMute) {
                audio.volume = 0
                volumeBar.value = 0
                volume.value = 0
                _this.currentVolume = 0
                _this.setConfig('currentVolume', _this.currentVolume)
            } else {
                audio.volume = _this.currentVolume
                volumeBar.value = _this.currentVolume * 100
                volume.value = _this.currentVolume * 100
            }
        }

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity 
        })
        cdThumbAnimate.pause()

        // Xử lý kích thước CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        // khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ song thay đỗi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent 
            }
        }

        // khi tua song
        progress.oninput = function (e) {
            const seakTime = audio.duration / 100 * e.target.value
            audio.currentTime = seakTime
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            _this.setConfig('currentIndex', _this.currentIndex)
        }

        // Khi previous song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            _this.setConfig('currentIndex', _this.currentIndex)
        }
        
        // Xử lý bật/tắt Random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        // Xử lý bật/tắt repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }

        // Xử lý khi ended song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option')
            if ( songNode || optionNode) {
                // xử lý click song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    _this.setConfig('currentIndex', _this.currentIndex)
                    audio.play()
                }

                // Xử lý click option
                if (e.target.closest('.option')) {

                }
            }
        }

        volume.oninput = function () {
            volumeBar.value = volume.value;
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) {
            this.currentIndex = newIndex
        }
        this.loadCurrentSong()
    },
    
    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex <= 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                }) // Element.scrollIntoView()
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                }) // Element.scrollIntoView()
            }

        }, 200)
    },
    start: function () {
        // Gán config lại vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính
        this.defineProperties()

        // Xử lý sự kiện
        this.handleEvent()

        // Tải thông tin bài hát hiện tại
        this.loadCurrentSong()

        // Render danh sách bài hát
        this.render()

        // hiển thiện trạng thái của repeat và random khi load lại trang
        
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)  
        volumeIcon.classList.toggle('mute', this.isMute)  
        audio.volume = this.currentVolume
        volumeBar.value = this.currentVolume * 100
        volume.value = this.currentVolume * 100
        audio.play()
    },
}
app.start()