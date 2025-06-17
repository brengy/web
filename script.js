document.addEventListener('DOMContentLoaded', function () {
    const sections = [
        { id: 'contentContainerC', label: 'C' },
        { id: 'contentContainerD', label: 'D' },
        { id: 'contentContainerE', label: 'E' },
        { id: 'contentContainerF', label: 'F' },
        { id: 'contentContainerG', label: 'G' },
        { id: 'contentContainerH', label: 'H', type: 'video' } // All videos here
    ];

    const apiKey = 'AIzaSyBh82Bqe-FfnZdzjGSVwmrpdKiURhhHaZ4';
    const sheetId = '1Vn9sSmLbbMvZ9lJO1HxhuU4v1Sjs7Hs7jOlZT2c-9ms';
    const sheetName = 'Sokar-Images';

    async function fetchContentFromSheet(range) {
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${range}?key=${apiKey}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Error fetching data: ${data.error.message}`);
            }

            return data.values.slice(1).flat(); // Remove headers and flatten
        } catch (error) {
            console.error('Error fetching content:', error);
            return [];
        }
    }

    function displayContent(contentArray, containerId, type = 'image') {
        const container = document.getElementById(containerId);
        contentArray.forEach(url => {
            if (!url) return;

            if (type === 'video') {
                createVideoElement(url, container);
            } else {
                createImageElement(url, container);
            }
        });
    }

    function createImageElement(src, container) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'T-shirt image';
        img.onclick = () => openModal(src, 'image');
        container.appendChild(img);
    }

    function createVideoElement(src, container) {
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const videoId = extractYouTubeID(src);
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.allow = "autoplay; fullscreen; picture-in-picture";
            iframe.frameBorder = "0";
            iframe.style.width = "100%";
            iframe.style.height = "auto";
            iframe.style.aspectRatio = "16/9";
            iframe.style.borderRadius = "10px";
            iframe.style.marginBottom = "10px";
            container.appendChild(iframe);

        } else if (src.includes('vimeo.com')) {
            const vimeoID = src.split('/').pop();
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoID}`;
            iframe.allow = "autoplay; fullscreen; picture-in-picture";
            iframe.frameBorder = "0";
            iframe.style.width = "100%";
            iframe.style.height = "auto";
            iframe.style.aspectRatio = "16/9";
            iframe.style.borderRadius = "10px";
            container.appendChild(iframe);

        } else if (src.includes('mega.nz')) {
            const link = document.createElement('a');
            link.href = src;
            link.target = "_blank";
            link.textContent = "View Video on Mega.nz";
            link.style.display = "block";
            link.style.margin = "10px 0";
            container.appendChild(link);
        } else {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.onclick = () => openModal(src, 'video');
            container.appendChild(video);
        }
    }

    function extractYouTubeID(url) {
        const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function openModal(src, type) {
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modalImage');
        const modalVideo = document.getElementById('modalVideo');
        const modalIframe = document.getElementById('modalIframe');

        modal.style.display = 'flex';
        modalImage.style.display = 'none';
        modalVideo.style.display = 'none';
        modalIframe.style.display = 'none';

        if (type === 'image') {
            modalImage.src = src;
            modalImage.style.display = 'block';
        } else if (type === 'video') {
            if (src.includes('vimeo.com')) {
                const vimeoID = src.split('/').pop();
                modalIframe.src = `https://player.vimeo.com/video/${vimeoID}`;
                modalIframe.style.display = 'block';
            } else {
                modalVideo.src = src;
                modalVideo.style.display = 'block';
            }
        }
    }

    function closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalImage').src = '';
        document.getElementById('modalVideo').src = '';
        document.getElementById('modalIframe').src = '';
    }

    document.getElementById('closeModal').onclick = closeModal;

    sections.forEach(async section => {
        const range = `${section.label}1:${section.label}`;
        const content = await fetchContentFromSheet(range);
        displayContent(content, section.id, section.type || 'image');
    });

document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', function () {
    const container = this.nextElementSibling;
    container.style.display = container.style.display === 'none' ? 'grid' : 'none';
  });
});




});
