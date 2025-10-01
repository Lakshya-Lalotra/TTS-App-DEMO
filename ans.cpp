#include <algorithm>
#include <iostream>
#include <mutex>
#include <set>
#include <string>
#include <unordered_map>
#include <vector>
#include <memory>
#include <ctime>  

struct ScoreEntry {
    std::string userId;
    int score;

    bool operator<(const ScoreEntry& other) const {
        if (score == other.score) return userId < other.userId;
        return score > other.score;
    }
};

class Leaderboard {
private:
    std::string leaderboardId;
    long startTime, endTime;
    std::set<ScoreEntry> scores; 
    std::unordered_map<std::string, int> userBestScore;
    mutable std::mutex mtx;

public:
    Leaderboard(std::string id, long start, long end)
        : leaderboardId(std::move(id)), startTime(start), endTime(end) {}

    std::string getId() const { return leaderboardId; }

    bool isActive(long now) const {
        return now >= startTime && now <= endTime;
    }

    void submitScore(const std::string& userId, int score, long now) {
        std::lock_guard<std::mutex> lock(mtx);
        if (!isActive(now)) return;

        auto it = userBestScore.find(userId);
        if (it != userBestScore.end()) {
            int prevScore = it->second;
            if (score <= prevScore) return; // ignore worse score
            scores.erase({userId, prevScore});
        }
        userBestScore[userId] = score;
        scores.insert({userId, score});
    }

    std::vector<ScoreEntry> getTop(int n) const {
        std::lock_guard<std::mutex> lock(mtx);
        std::vector<ScoreEntry> res;
        int count = 0;
        for (const auto& s : scores) {
            if (count++ >= n) break;
            res.push_back(s);
        }
        return res;
    }

    std::vector<ScoreEntry> listPlayerAround(const std::string& userId, int n) const {
        std::lock_guard<std::mutex> lock(mtx);
        std::vector<ScoreEntry> all(scores.begin(), scores.end());
        std::vector<ScoreEntry> res;

        auto it = std::find_if(all.begin(), all.end(),
                               [&](const ScoreEntry& e) { return e.userId == userId; });

        if (it == all.end()) return res; // user not found

        int idx = std::distance(all.begin(), it);
        int start = std::max(0, idx - n);
        int end = std::min((int)all.size() - 1, idx + n);

        for (int i = start; i <= end; i++) res.push_back(all[i]);
        return res;
    }
};

class LeaderboardRepository {
private:
    std::unordered_map<std::string, std::vector<std::shared_ptr<Leaderboard>>> gameLeaderboards;
    mutable std::mutex mtx;

public:
    std::shared_ptr<Leaderboard> createLeaderboard(const std::string& gameId, long start, long end) {
        std::lock_guard<std::mutex> lock(mtx);
        std::string leaderboardId = gameId + "_" + std::to_string(start) + "_" + std::to_string(end); 
        auto lb = std::make_shared<Leaderboard>(leaderboardId, start, end);
        gameLeaderboards[gameId].push_back(lb);
        return lb;
    }

    std::vector<std::shared_ptr<Leaderboard>> getLeaderboards(const std::string& gameId) const {
        std::lock_guard<std::mutex> lock(mtx);
        auto it = gameLeaderboards.find(gameId);
        if (it == gameLeaderboards.end()) return {};
        return it->second;
    }
};

class LeaderboardService {
private:
    LeaderboardRepository repo;

public:
    void createLeaderboard(const std::string& gameId, long start, long end) {
        repo.createLeaderboard(gameId, start, end);
    }

    void submitScore(const std::string& gameId, const std::string& userId, int score, long now) {
        auto leaderboards = repo.getLeaderboards(gameId);
        for (auto& lb : leaderboards) {
            lb->submitScore(userId, score, now);
        }
    }

    std::vector<ScoreEntry> getLeaderboard(const std::string& gameId, const std::string& leaderboardId, int topN) {
        auto leaderboards = repo.getLeaderboards(gameId);
        for (auto& lb : leaderboards) {
            if (lb->getId() == leaderboardId) {
                return lb->getTop(topN);
            }
        }
        return {};
    }

    std::vector<ScoreEntry> listPlayerAround(const std::string& gameId, const std::string& leaderboardId,
                                             const std::string& userId, int n) {
        auto leaderboards = repo.getLeaderboards(gameId);
        for (auto& lb : leaderboards) {
            if (lb->getId() == leaderboardId) {
                return lb->listPlayerAround(userId, n);
            }
        }
        return {};
    }
};

int main() {
    LeaderboardService service;
    long now = std::time(0);

    service.createLeaderboard("game1", now - 10, now + 3600);
    service.createLeaderboard("game1", now - 10, now + 7200);

    service.submitScore("game1", "userA", 500, now);
    service.submitScore("game1", "userB", 800, now);
    service.submitScore("game1", "userC", 1000, now);

    std::string leaderboardId = "game1_" + std::to_string(now - 10) + "_" + std::to_string(now + 3600);  // ✅ fixed

    std::cout << "Top Scores:\n";
    for (auto& e : service.getLeaderboard("game1", leaderboardId, 5)) {
        std::cout << e.userId << " => " << e.score << "\n";
    }

    std::cout << "\nPlayers around userA:\n";
    for (auto& e : service.listPlayerAround("game1", leaderboardId, "userA", 1)) {
        std::cout << e.userId << " => " << e.score << "\n";
    }

    return 0;
}
